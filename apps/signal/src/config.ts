import type { IceServer } from "@parlo/protocol";

const num = (v: string | undefined, d: number) =>
  v && Number.isFinite(Number(v)) ? Number(v) : d;

export const config = {
  port: num(process.env.PORT, 8787),

  /**
   * Postgres for durable moderation state (bans, reports). Absent =
   * in-memory fallback for local dev only; bans die with the process.
   * Works with any Postgres: Supabase, Neon, or a local instance.
   */
  databaseUrl: process.env.DATABASE_URL,

  /**
   * Parlo's tables live in their own schema, not `public`. Databases
   * get shared, and `reports` is a name half the world already uses —
   * writing into someone else's table is not a failure mode worth
   * leaving open. Must be a bare identifier: it is passed as a libpq
   * connection option, not a bound parameter.
   */
  dbSchema: (() => {
    const schema = process.env.DB_SCHEMA ?? "parlo";
    if (!/^[a-z_][a-z0-9_]*$/.test(schema)) {
      throw new Error(`DB_SCHEMA must be a lowercase bare identifier, got "${schema}"`);
    }
    return schema;
  })(),

  /**
   * What to do when the ban lookup itself fails. Default is to deny —
   * an outage that lets every banned device back in is the worse of
   * the two failure modes. Flip only as a deliberate availability call.
   */
  banCheckFailOpen: process.env.BAN_CHECK_FAIL_OPEN === "true",

  /** Allowed browser origins. "*" only in development. */
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  /** Matcher sweep interval. */
  tickMs: num(process.env.MATCH_TICK_MS, 250),

  /**
   * Language/region constraints are progressively dropped after this
   * long in the queue. Gender preferences are NEVER auto-relaxed.
   */
  relaxAfterMs: num(process.env.RELAX_AFTER_MS, 20_000),

  /** A pair is not re-matched within this window. */
  rematchCooldownMs: num(process.env.REMATCH_COOLDOWN_MS, 15 * 60_000),

  heartbeatMs: num(process.env.HEARTBEAT_MS, 30_000),

  rateLimit: {
    /** Messages per session per 10s window, across all message types. */
    messagesPer10s: num(process.env.RL_MESSAGES, 80),
    /** Chat lines per 10s — tighter, this is the spam surface. */
    chatPer10s: num(process.env.RL_CHAT, 15),
    /**
     * Reports per device per window, enforced against the database so
     * it survives reconnects. Report spam is itself an abuse vector —
     * but minor-safety reports are exempt, see submitReport.
     */
    reportsPerWindow: num(process.env.RL_REPORTS, 20),
    reportWindowMs: num(process.env.RL_REPORT_WINDOW_MS, 60 * 60_000),
  },

  moderation: {
    /** Strikes within the window that trigger an automatic ban. */
    strikeThreshold: num(process.env.STRIKE_THRESHOLD, 3),
    strikeWindowMs: num(process.env.STRIKE_WINDOW_MS, 24 * 60 * 60_000),
    banMs: num(process.env.BAN_MS, 24 * 60 * 60_000),
    /**
     * Reports naming a minor bypass the strike counter entirely and
     * ban on first report, pending human review. See LEGAL.md §3.
     */
    minorReportInstantBan: true,
  },

  /**
   * Require a verified age-assurance token before queueing.
   * MUST be true in production. See LEGAL.md §2.
   */
  requireAgeToken: process.env.REQUIRE_AGE_TOKEN === "true",

  /**
   * STUN is free and gets ~80-90% of peers connected. The rest sit
   * behind symmetric NAT and need TURN, which relays real media and
   * therefore costs real bandwidth. Budget for it before launch.
   */
  iceServers(): IceServer[] {
    const servers: IceServer[] = [
      { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
    ];
    if (process.env.TURN_URL) {
      servers.push({
        urls: process.env.TURN_URL,
        username: process.env.TURN_USERNAME,
        credential: process.env.TURN_CREDENTIAL,
      });
    }
    return servers;
  },
} as const;
