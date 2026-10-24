-- Parlo — durable moderation state.
--
-- Apply to any Postgres 14+ (Supabase, Neon, local). Idempotent:
-- safe to re-run.
--
-- Everything lives in a dedicated `parlo` schema rather than `public`.
-- Databases get shared, and `reports` is a name plenty of other apps
-- already use — writing into someone else's table is not a failure
-- mode worth leaving open. Override with DB_SCHEMA if you rename it.
--
-- There is deliberately NO "strikes" table. Strikes are derived from
-- the reports below by counting DISTINCT accusers in a window — a
-- separate counter can drift away from the audit trail it claims to
-- summarise, and the audit trail is what you have to defend.

create schema if not exists parlo;
set search_path to parlo;

create table if not exists bans (
  device_id   uuid        primary key,
  reason      text        not null,
  until       timestamptz not null,
  -- 'auto' (strike threshold / minor report) or 'manual' (moderator).
  source      text        not null default 'auto',
  created_at  timestamptz not null default now()
);

-- The hot path: every connection checks this on handshake.
create index if not exists bans_until_idx on bans (until);

create table if not exists reports (
  id                 uuid        primary key,
  room_id            uuid        not null,
  reporter_device_id uuid        not null,
  accused_device_id  uuid        not null,
  reason             text        not null,
  note               text,
  severity           text        not null default 'normal',
  created_at         timestamptz not null default now(),

  -- Unreviewed reports are the liability. See LEGAL.md §3-4: the
  -- documented record of what you were told and when you acted on it
  -- is the defence against a product-design claim.
  reviewed_at        timestamptz,
  reviewed_by        text,
  outcome            text,

  constraint reports_severity_ck check (severity in ('normal', 'high', 'critical')),
  constraint reports_outcome_ck  check (outcome is null or outcome in ('upheld', 'dismissed')),
  -- One report per reporter per room: re-reporting the same session
  -- must not stack toward a ban.
  constraint reports_once_per_room unique (room_id, reporter_device_id)
);

-- Strike counting: distinct accusers of one device, recent first.
create index if not exists reports_accused_idx
  on reports (accused_device_id, created_at desc);

-- Durable per-reporter rate limiting (survives reconnects).
create index if not exists reports_reporter_idx
  on reports (reporter_device_id, created_at desc);

-- The moderation queue. Partial index: unreviewed rows are the only
-- ones ever scanned here, and they stay a small fraction of the table.
create index if not exists reports_unreviewed_idx
  on reports (severity, created_at) where reviewed_at is null;
