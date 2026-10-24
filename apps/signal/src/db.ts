import pg from "pg";
import { config } from "./config.js";

/* ------------------------------------------------------------------ *
 * Durable moderation storage.
 *
 * Two backends behind one interface: Postgres when DATABASE_URL is
 * set, in-memory otherwise. The in-memory one exists so local dev and
 * the smoke test run with no database — it is NOT a production option,
 * and the server says so loudly at boot.
 * ------------------------------------------------------------------ */

export interface BanRow {
  until: number;
  reason: string;
}

export interface ReportInput {
  id: string;
  roomId: string;
  reporterDeviceId: string;
  accusedDeviceId: string;
  reason: string;
  note?: string;
  severity: "normal" | "high" | "critical";
}

export interface ReportRow extends ReportInput {
  createdAt: number;
  reviewedAt: number | null;
  outcome: string | null;
}

export interface Store {
  readonly kind: "postgres" | "memory";
  init(): Promise<void>;
  close(): Promise<void>;

  getBan(deviceId: string): Promise<BanRow | null>;
  putBan(deviceId: string, reason: string, until: number, source: string): Promise<void>;

  insertReport(input: ReportInput): Promise<void>;
  /**
   * Distinct accusers in the window — NOT raw report count. Counting
   * reports would let one person ban anyone by reporting repeatedly.
   */
  countDistinctAccusers(accusedDeviceId: string, sinceMs: number): Promise<number>;
  /** Reports filed BY this device in the window — durable rate limit. */
  countReportsBy(reporterDeviceId: string, sinceMs: number): Promise<number>;
  listUnreviewed(limit: number): Promise<ReportRow[]>;
}

/* ----------------------------- memory ----------------------------- */

class MemoryStore implements Store {
  readonly kind = "memory" as const;
  private bans = new Map<string, BanRow>();
  private reports: ReportRow[] = [];

  async init() {}
  async close() {}

  async getBan(deviceId: string) {
    const ban = this.bans.get(deviceId);
    if (!ban) return null;
    if (ban.until <= Date.now()) {
      this.bans.delete(deviceId);
      return null;
    }
    return ban;
  }

  async putBan(deviceId: string, reason: string, until: number) {
    this.bans.set(deviceId, { until, reason });
  }

  async insertReport(input: ReportInput) {
    // Mirror the unique (room_id, reporter_device_id) constraint, and
    // signal it the way pg does. A dev backend that accepts what prod
    // rejects just moves the bug to where it costs more.
    const duplicate = this.reports.some(
      (r) => r.roomId === input.roomId && r.reporterDeviceId === input.reporterDeviceId,
    );
    if (duplicate) {
      throw Object.assign(new Error("duplicate report for room"), { code: "23505" });
    }
    this.reports.push({ ...input, createdAt: Date.now(), reviewedAt: null, outcome: null });
  }

  async countDistinctAccusers(accusedDeviceId: string, sinceMs: number) {
    const cutoff = Date.now() - sinceMs;
    const accusers = new Set(
      this.reports
        .filter((r) => r.accusedDeviceId === accusedDeviceId && r.createdAt >= cutoff)
        .map((r) => r.reporterDeviceId),
    );
    return accusers.size;
  }

  async countReportsBy(reporterDeviceId: string, sinceMs: number) {
    const cutoff = Date.now() - sinceMs;
    return this.reports.filter(
      (r) => r.reporterDeviceId === reporterDeviceId && r.createdAt >= cutoff,
    ).length;
  }

  async listUnreviewed(limit: number) {
    return this.reports.filter((r) => r.reviewedAt === null).slice(0, limit);
  }
}

/* ---------------------------- postgres ---------------------------- */

class PostgresStore implements Store {
  readonly kind = "postgres" as const;
  private pool: pg.Pool;

  constructor(connectionString: string) {
    this.pool = new pg.Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      // Pin every connection to Parlo's own schema. config.dbSchema is
      // validated as a bare identifier, so it is safe to interpolate
      // here — libpq options are not parameterisable.
      options: `-c search_path=${config.dbSchema}`,
      // Supabase/Neon poolers terminate TLS with their own chain.
      ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
    });
    // A pool error with no listener crashes the process on a dropped
    // backend connection, which is a routine event.
    this.pool.on("error", (err) => console.error("[db] idle client error:", err.message));
  }

  async init() {
    // Fail fast and loudly: a moderation store that silently isn't
    // there is worse than a server that refuses to boot.
    const { rows } = await this.pool.query("select 1 as ok");
    if (rows[0]?.ok !== 1) throw new Error("database health check failed");

    const { rows: tables } = await this.pool.query(
      `select table_name from information_schema.tables
       where table_schema = $1 and table_name in ('bans','reports')`,
      [config.dbSchema],
    );
    if (tables.length < 2) {
      throw new Error(
        `moderation tables missing in schema "${config.dbSchema}" — ` +
          "apply db/migrations/001_moderation.sql first",
      );
    }
  }

  async close() {
    await this.pool.end();
  }

  async getBan(deviceId: string) {
    const { rows } = await this.pool.query<{ reason: string; until: Date }>(
      `select reason, until from bans where device_id = $1 and until > now()`,
      [deviceId],
    );
    if (!rows.length) return null;
    return { reason: rows[0].reason, until: rows[0].until.getTime() };
  }

  async putBan(deviceId: string, reason: string, until: number, source: string) {
    await this.pool.query(
      `insert into bans (device_id, reason, until, source)
       values ($1, $2, to_timestamp($3 / 1000.0), $4)
       on conflict (device_id) do update
         set reason = excluded.reason,
             until = greatest(bans.until, excluded.until),
             source = excluded.source`,
      [deviceId, reason, until, source],
    );
  }

  async insertReport(input: ReportInput) {
    await this.pool.query(
      `insert into reports
         (id, room_id, reporter_device_id, accused_device_id, reason, note, severity)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [
        input.id,
        input.roomId,
        input.reporterDeviceId,
        input.accusedDeviceId,
        input.reason,
        input.note ?? null,
        input.severity,
      ],
    );
  }

  async countDistinctAccusers(accusedDeviceId: string, sinceMs: number) {
    const { rows } = await this.pool.query<{ n: string }>(
      `select count(distinct reporter_device_id)::text as n from reports
       where accused_device_id = $1
         and created_at > now() - ($2::bigint * interval '1 millisecond')`,
      [accusedDeviceId, sinceMs],
    );
    return Number(rows[0]?.n ?? 0);
  }

  async countReportsBy(reporterDeviceId: string, sinceMs: number) {
    const { rows } = await this.pool.query<{ n: string }>(
      `select count(*)::text as n from reports
       where reporter_device_id = $1
         and created_at > now() - ($2::bigint * interval '1 millisecond')`,
      [reporterDeviceId, sinceMs],
    );
    return Number(rows[0]?.n ?? 0);
  }

  async listUnreviewed(limit: number) {
    const { rows } = await this.pool.query(
      `select id, room_id, reporter_device_id, accused_device_id, reason, note,
              severity, created_at, reviewed_at, outcome
       from reports where reviewed_at is null
       order by
         case severity when 'critical' then 0 when 'high' then 1 else 2 end,
         created_at asc
       limit $1`,
      [limit],
    );
    return rows.map((r) => ({
      id: r.id,
      roomId: r.room_id,
      reporterDeviceId: r.reporter_device_id,
      accusedDeviceId: r.accused_device_id,
      reason: r.reason,
      note: r.note ?? undefined,
      severity: r.severity,
      createdAt: r.created_at.getTime(),
      reviewedAt: r.reviewed_at ? r.reviewed_at.getTime() : null,
      outcome: r.outcome,
    }));
  }
}

/* ---------------------------- selection --------------------------- */

export const store: Store = config.databaseUrl
  ? new PostgresStore(config.databaseUrl)
  : new MemoryStore();

export async function initStore() {
  if (store.kind === "memory") {
    console.warn(
      "[db] no DATABASE_URL — moderation state is IN MEMORY and is lost on restart. Development only.",
    );
    return;
  }
  // Transient blips at boot are normal (pooler warming, deploy races);
  // a persistent failure is not something to start up through.
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await store.init();
      console.log(`[db] postgres moderation store ready (schema: ${config.dbSchema})`);
      return;
    } catch (err) {
      const message = (err as Error).message;
      if (attempt === 3) {
        console.error(`[db] FATAL: ${message}`);
        throw err;
      }
      console.warn(`[db] attempt ${attempt}/3 failed (${message}), retrying…`);
      await new Promise((r) => setTimeout(r, attempt * 1000));
    }
  }
}
