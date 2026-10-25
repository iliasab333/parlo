"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";

/**
 * A self-declared checkbox is NOT age assurance and will not satisfy
 * the UK OSA, the US state AV statutes, or an App Store reviewer. This
 * component is the placement and the UX; swap the confirm handler for
 * a real provider flow (Yoti / Persona / k-ID) before launch.
 * See LEGAL.md §2.
 */
export function AgeGate({ t, onConfirm }: { t: Dictionary; onConfirm: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/90 p-6 backdrop-blur">
      <div className="w-full max-w-md rounded-2xl border border-ink-800 bg-ink-900 p-7">
        <h2 className="text-xl font-semibold">{t.gate.title}</h2>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-300">
{t.gate.body}
        </p>

        <div className="mt-5 rounded-xl border border-warn/30 bg-warn/10 p-3.5 text-xs leading-relaxed text-ink-300">
<strong className="text-warn">{t.gate.pendingLabel}</strong> {t.gate.pending}
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 size-4 accent-[var(--color-accent)]"
          />
<span className="text-ink-300">{t.gate.confirm}</span>
        </label>

        <button
          disabled={!checked}
          onClick={onConfirm}
          className="mt-6 w-full rounded-xl bg-accent py-3 font-semibold text-ink-950 transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
        >
          {t.gate.continue}
        </button>
      </div>
    </div>
  );
}
