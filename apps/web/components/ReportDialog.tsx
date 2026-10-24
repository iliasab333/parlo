"use client";

import { useState } from "react";

type Reason = "nudity" | "minor" | "harassment" | "spam" | "violence" | "other";

const REASONS: { value: Reason; label: string; detail?: string }[] = [
  { value: "minor", label: "Parece ser menor de edad", detail: "Revisión prioritaria inmediata" },
  { value: "nudity", label: "Desnudez o contenido sexual" },
  { value: "harassment", label: "Acoso o insultos" },
  { value: "violence", label: "Violencia o amenazas" },
  { value: "spam", label: "Spam o publicidad" },
  { value: "other", label: "Otro motivo" },
];

export function ReportDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (reason: Reason, note?: string) => void;
}) {
  const [reason, setReason] = useState<Reason | null>(null);
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/85 p-6 backdrop-blur">
      <div className="w-full max-w-md rounded-2xl border border-ink-800 bg-ink-900 p-7">
        <h2 className="text-lg font-semibold">Reportar a esta persona</h2>
        <p className="mt-1.5 text-sm text-ink-500">
          La conversación terminará de inmediato.
        </p>

        <div className="mt-5 space-y-2">
          {REASONS.map((r) => (
            <button
              key={r.value}
              onClick={() => setReason(r.value)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                reason === r.value
                  ? "border-danger bg-danger/10"
                  : "border-ink-700 hover:border-ink-500"
              }`}
            >
              {r.label}
              {r.detail && (
                <span className="mt-0.5 block text-xs text-warn">{r.detail}</span>
              )}
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 500))}
          placeholder="Detalles (opcional)"
          rows={3}
          className="mt-4 w-full resize-none rounded-lg border border-ink-700 bg-ink-950 px-3 py-2 text-sm outline-none placeholder:text-ink-500 focus:border-accent"
        />

        <div className="mt-5 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-ink-700 py-2.5 text-sm font-medium text-ink-300 hover:border-ink-500"
          >
            Cancelar
          </button>
          <button
            disabled={!reason}
            onClick={() => reason && onSubmit(reason, note.trim() || undefined)}
            className="flex-1 rounded-xl bg-danger py-2.5 text-sm font-semibold text-ink-100 transition enabled:hover:brightness-110 disabled:opacity-35"
          >
            Enviar reporte
          </button>
        </div>
      </div>
    </div>
  );
}
