"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { SessionTimer } from "@/lib/useParlo";

const UNLIMITED = Number.MAX_SAFE_INTEGER;

function mmss(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/**
 * The countdown is the product, not decoration: it makes leaving the
 * default, so neither person has to be the one who ends it. Staying
 * requires both to say so, which is why a one-sided request shows as
 * "waiting" rather than silently doing nothing.
 */
export function SessionClock({
  t,
  timer,
  onExtend,
}: {
  t: Dictionary;
  timer: SessionTimer;
  onExtend: () => void;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  if (timer.endsAt >= UNLIMITED) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1.5 text-sm text-accent">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
          <path d="M12 6v6l4 2" strokeLinecap="round" />
        </svg>
        {t.session.unlimited}
      </div>
    );
  }

  const remaining = timer.endsAt - now;
  const urgent = remaining < 30_000;
  const critical = remaining < 10_000;

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`rounded-lg px-3 py-1.5 font-mono text-sm tabular-nums transition-colors ${
          critical
            ? "bg-danger/20 text-danger"
            : urgent
              ? "bg-warn/15 text-warn"
              : "bg-ink-800 text-ink-300"
        }`}
        aria-live={urgent ? "polite" : "off"}
      >
        {mmss(remaining)}
      </div>

      {timer.youWant ? (
        <span className="text-sm text-ink-500">
          {timer.peerWants ? t.session.bothIn : t.session.waitingPeer}
        </span>
      ) : (
        <button
          onClick={onExtend}
          className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
            timer.peerWants
              ? "bg-accent text-ink-950 hover:brightness-110"
              : urgent
                ? "bg-accent text-ink-950 hover:brightness-110"
                : "border border-ink-700 text-ink-300 hover:border-accent hover:text-accent"
          }`}
        >
          {timer.peerWants ? t.session.peerWants : t.session.keepTalking}
        </button>
      )}
    </div>
  );
}
