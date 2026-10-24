import { randomUUID, createHmac } from "node:crypto";
import { config } from "./config.js";
import { store, type ReportRow } from "./db.js";

const DEVICE_SECRET =
  process.env.DEVICE_TOKEN_SECRET ?? "dev-only-insecure-secret-change-me";

/**
 * Device tokens are the weakest link in any anonymous chat product:
 * clearing localStorage mints a new identity. Signing them stops
 * trivial forgery, nothing more. A real ban system layers account +
 * phone/email verification + device fingerprint. See LEGAL.md §5.
 */
export function issueDeviceToken(): string {
  const id = randomUUID();
  const sig = createHmac("sha256", DEVICE_SECRET).update(id).digest("base64url");
  return `${id}.${sig}`;
}

export function verifyDeviceToken(token: string | undefined): string | null {
  if (!token) return null;
  const [id, sig] = token.split(".");
  if (!id || !sig) return null;
  const expected = createHmac("sha256", DEVICE_SECRET).update(id).digest("base64url");
  return sig === expected ? id : null;
}

/* ----------------------------- bans ------------------------------- */

export interface Ban {
  until: number;
  reason: string;
}

/**
 * On a database error this denies the connection by default. A
 * moderation check that fails open lets every banned device back in
 * for the duration of the outage, which is the failure mode that ends
 * up in a filing. Set BAN_CHECK_FAIL_OPEN=true to trade that for
 * availability — deliberately, not by accident.
 */
export async function isBanned(deviceId: string): Promise<Ban | null> {
  try {
    return await store.getBan(deviceId);
  } catch (err) {
    console.error(`[safety] ban lookup failed for ${deviceId}:`, (err as Error).message);
    if (config.banCheckFailOpen) return null;
    return { until: Date.now() + 60_000, reason: "Servicio no disponible, inténtalo en un minuto." };
  }
}

export async function ban(
  deviceId: string,
  reason: string,
  ms = config.moderation.banMs,
  source = "auto",
): Promise<Ban> {
  const until = Date.now() + ms;
  await store.putBan(deviceId, reason, until, source);
  console.warn(
    `[safety] banned device=${deviceId} reason="${reason}" until=${new Date(until).toISOString()}`,
  );
  return { until, reason };
}

/* ---------------------------- reports ----------------------------- */

export type ReportOutcome =
  | { accepted: true; banned: boolean; until?: number }
  | { accepted: false; code: "duplicate" | "rate_limited" | "error" };

export function listUnreviewedReports(limit = 100): Promise<ReportRow[]> {
  return store.listUnreviewed(limit);
}

export async function submitReport(input: {
  roomId: string;
  reporterDeviceId: string;
  accusedDeviceId: string;
  reason: string;
  note?: string;
}): Promise<ReportOutcome> {
  const isMinorReport =
    input.reason === "minor" && config.moderation.minorReportInstantBan;
  const severity = isMinorReport ? "critical" : "normal";

  // Durable per-reporter limit. The old per-connection limiter reset
  // on every reconnect, which made it decorative. Minor-safety reports
  // are never rate limited — suppressing one of those to save a query
  // is not a trade worth making.
  if (!isMinorReport) {
    try {
      const recent = await store.countReportsBy(
        input.reporterDeviceId,
        config.rateLimit.reportWindowMs,
      );
      if (recent >= config.rateLimit.reportsPerWindow) {
        return { accepted: false, code: "rate_limited" };
      }
    } catch (err) {
      console.error("[safety] report rate check failed:", (err as Error).message);
    }
  }

  const record = { id: randomUUID(), severity, ...input } as const;

  try {
    await store.insertReport(record);
  } catch (err) {
    // The unique (room_id, reporter_device_id) constraint: re-reporting
    // the same session must not stack toward a ban.
    if ((err as { code?: string }).code === "23505") {
      return { accepted: false, code: "duplicate" };
    }
    console.error("[safety] report insert failed:", (err as Error).message);
    return { accepted: false, code: "error" };
  }

  escalateToHumanReview(record, severity);

  // Reports alleging a minor bypass the strike threshold entirely and
  // ban on first report, pending human review. See LEGAL.md §3 for the
  // NCMEC reporting duty that sits behind this path.
  if (isMinorReport) {
    const { until } = await ban(
      input.accusedDeviceId,
      "pending review: minor safety report",
    );
    return { accepted: true, banned: true, until };
  }

  // DISTINCT accusers, not report count: otherwise one determined
  // person could ban anyone by reporting them repeatedly.
  let accusers = 0;
  try {
    accusers = await store.countDistinctAccusers(
      input.accusedDeviceId,
      config.moderation.strikeWindowMs,
    );
  } catch (err) {
    console.error("[safety] strike count failed:", (err as Error).message);
    return { accepted: true, banned: false };
  }

  if (accusers >= config.moderation.strikeThreshold) {
    const { until } = await ban(
      input.accusedDeviceId,
      `${accusers} denuncias independientes`,
    );
    return { accepted: true, banned: true, until };
  }

  return { accepted: true, banned: false };
}

/* ------------------------- integration hooks ---------------------- *
 * Deliberately left as no-ops with explicit signatures. Each one is a
 * vendor decision with cost and compliance consequences — wiring them
 * is a launch blocker, not a nice-to-have. See LEGAL.md.
 * ------------------------------------------------------------------ */

/**
 * Verify a token from an age-assurance provider (Yoti, Persona,
 * Veriff, k-ID, Stripe Identity). Must validate the signature and
 * expiry server-side — a client-asserted "I am 18" is worth nothing.
 * LEGAL.md §2.
 */
export async function verifyAgeToken(token: string | undefined): Promise<boolean> {
  if (!config.requireAgeToken) return true;
  if (!token) return false;
  // TODO: replace with real provider verification before production.
  throw new Error("Age assurance provider not configured (REQUIRE_AGE_TOKEN=true)");
}

/**
 * Route a report into the human review queue. The row is already
 * durable by the time this runs, so this is notification, not storage
 * — but an unreviewed queue nobody is paged for is still a liability.
 */
function escalateToHumanReview(
  record: { reason: string; roomId: string; accusedDeviceId: string },
  severity: "normal" | "high" | "critical",
) {
  console.warn(
    `[review:${severity}] ${record.reason} room=${record.roomId} accused=${record.accusedDeviceId}`,
  );
  // TODO: push to moderation queue; page on-call for "critical".
}

/* --------------------------- rate limiting ------------------------ */

/**
 * Per-connection limiter for chat and message floods. Correct in
 * memory: it guards one socket, and a reconnect costs the attacker a
 * handshake. Report limiting is durable instead — see submitReport.
 */
export class RateLimiter {
  private hits: number[] = [];
  constructor(private readonly limit: number, private readonly windowMs: number) {}

  /** Returns true when the action is allowed. */
  take(): boolean {
    const now = Date.now();
    this.hits = this.hits.filter((t) => now - t < this.windowMs);
    if (this.hits.length >= this.limit) return false;
    this.hits.push(now);
    return true;
  }
}
