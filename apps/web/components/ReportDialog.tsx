"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";

type Reason = "nudity" | "minor" | "harassment" | "spam" | "violence" | "other";

/** `minor` first and flagged: the one report that must never be buried. */
const REASON_ORDER: Reason[] = ["minor", "nudity", "harassment", "violence", "spam", "other"];

export function ReportDialog({
  t,
  onClose,
  onSubmit,
}: {
  t: Dictionary;
  onClose: () => void;
  onSubmit: (reason: Reason, note?: string) => void;
}) {
  const [reason, setReason] = useState<Reason | null>(null);
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/85 p-6 backdrop-blur">
      <div className="w-full max-w-md rounded-2xl border border-ink-800 bg-ink-900 p-7">
        <h2 className="text-lg font-semibold">{t.report.title}</h2>
        <p className="mt-1.5 text-sm text-ink-500">{t.report.subtitle}</p>

        <div className="mt-5 space-y-2">
          {REASON_ORDER.map((value) => (
            <button
              key={value}
              onClick={() => setReason(value)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                reason === value
                  ? "border-danger bg-danger/10"
                  : "border-ink-700 hover:border-ink-500"
              }`}
            >
              {t.report.reasons[value]}
              {value === "minor" && (
                <span className="mt-0.5 block text-xs text-warn">{t.report.priority}</span>
              )}
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 500))}
          placeholder={t.report.detailsPlaceholder}
          rows={3}
          className="mt-4 w-full resize-none rounded-lg border border-ink-700 bg-ink-950 px-3 py-2 text-sm outline-none placeholder:text-ink-500 focus:border-accent"
        />

        <div className="mt-5 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-ink-700 py-2.5 text-sm font-medium text-ink-300 hover:border-ink-500"
          >
            {t.report.cancel}
          </button>
          <button
            disabled={!reason}
            onClick={() => reason && onSubmit(reason, note.trim() || undefined)}
            className="flex-1 rounded-xl bg-danger py-2.5 text-sm font-semibold text-ink-100 transition enabled:hover:brightness-110 disabled:opacity-35"
          >
            {t.report.submit}
          </button>
        </div>
      </div>
    </div>
  );
}
