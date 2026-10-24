"use client";

import Link from "next/link";
import { useState } from "react";
import { LANGUAGE_NAMES, type Prefs, type Profile, type PublicProfile } from "@parlo/protocol";
import { useParlo } from "@/lib/useParlo";
import { AgeGate } from "@/components/AgeGate";
import { SetupPanel } from "@/components/SetupPanel";
import { VideoStage } from "@/components/VideoStage";
import { ChatPane } from "@/components/ChatPane";
import { ReportDialog } from "@/components/ReportDialog";

function PeerCard({ peer }: { peer: PublicProfile }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span className="font-semibold">{peer.displayName ?? "Anónimo"}</span>
      {peer.region && (
        <span className="rounded-md bg-ink-800 px-2 py-0.5 text-xs text-ink-300">
          {peer.region}
        </span>
      )}
      {peer.international && (
        <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs text-accent">
          Internacional
        </span>
      )}
      <span className="text-xs text-ink-500">
        Habla {peer.speaks.map((l) => LANGUAGE_NAMES[l]).join(", ")} · Practica{" "}
        {peer.learning.map((l) => LANGUAGE_NAMES[l]).join(", ")}
      </span>
    </div>
  );
}

export default function ChatPage() {
  const parlo = useParlo();
  const [ageOk, setAgeOk] = useState(false);
  const [reporting, setReporting] = useState(false);

  const inSession = parlo.status === "queued" || parlo.status === "matched";

  function handleStart(profile: Profile, prefs: Prefs) {
    void parlo.start(profile, prefs);
  }

  if (parlo.status === "banned") {
    return (
      <main className="grid min-h-dvh place-items-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">Cuenta suspendida</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">{parlo.error}</p>
          <p className="mt-4 text-xs text-ink-500">
            Si crees que es un error, puedes apelar escribiendo a
            soporte@parlo.example.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-dvh max-w-6xl flex-col px-5 py-5">
      {!ageOk && <AgeGate onConfirm={() => setAgeOk(true)} />}

      <header className="mb-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-lg bg-accent/15 text-accent">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-4.3-1L3 20l1.3-4a8.2 8.2 0 0 1-1.1-4.5 8.4 8.4 0 0 1 8.9-8.4 8.4 8.4 0 0 1 8.9 8.4Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-semibold tracking-tight">Parlo</span>
        </Link>

        <div className="flex items-center gap-4 text-xs text-ink-500">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent" />
            {parlo.stats.online} en línea
          </span>
          <span>{parlo.stats.waiting} buscando</span>
        </div>
      </header>

      {parlo.error && (
        <div className="mb-4 rounded-xl border border-danger/40 bg-danger/10 px-4 py-2.5 text-sm text-ink-100">
          {parlo.error}
        </div>
      )}

      {/* Lobby ------------------------------------------------------- */}
      {(parlo.status === "idle" || parlo.status === "connecting") && (
        <div className="scroll-slim flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl rounded-2xl border border-ink-800 bg-ink-900/50 p-7">
            <h1 className="text-xl font-semibold">Configura tu sesión</h1>
            <p className="mt-1.5 mb-7 text-sm text-ink-500">
              {parlo.status === "connecting"
                ? "Conectando con el servidor…"
                : "Te emparejaremos con alguien compatible."}
            </p>
            <SetupPanel disabled={parlo.status !== "idle"} onStart={handleStart} />
          </div>
        </div>
      )}

      {/* Searching --------------------------------------------------- */}
      {parlo.status === "queued" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <div className="pulse-ring relative size-16 rounded-full bg-accent/15" />
          <div className="text-center">
            <p className="font-medium">Buscando compañero…</p>
            <p className="mt-1.5 max-w-sm text-sm text-ink-500">
              Ampliamos idioma y región a medida que pasa el tiempo. Tu filtro de
              género se mantiene siempre.
            </p>
          </div>
          <button
            onClick={parlo.stop}
            className="rounded-xl border border-ink-700 px-5 py-2.5 text-sm font-medium text-ink-300 hover:border-ink-500"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* In session -------------------------------------------------- */}
      {parlo.status === "matched" && parlo.peer && (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <PeerCard peer={parlo.peer} />
            <div className="flex gap-2">
              <button
                onClick={() => setReporting(true)}
                className="rounded-lg border border-ink-700 px-3.5 py-2 text-sm text-ink-300 transition hover:border-danger hover:text-danger"
              >
                Reportar
              </button>
              <button
                onClick={parlo.skip}
                className="rounded-lg bg-ink-800 px-4 py-2 text-sm font-medium transition hover:bg-ink-700"
              >
                Siguiente
              </button>
              <button
                onClick={parlo.stop}
                className="rounded-lg border border-ink-700 px-3.5 py-2 text-sm text-ink-300 hover:border-ink-500"
              >
                Salir
              </button>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
            <VideoStage
              local={parlo.localStream}
              remote={parlo.remoteStream}
              peerName={parlo.peer.displayName ?? "Anónimo"}
            />

            <ChatPane
              messages={parlo.messages}
              peerTyping={parlo.peerTyping}
              disabled={false}
              onSend={parlo.sendChat}
              onTyping={parlo.setTyping}
            />
          </div>
        </div>
      )}

      {inSession && (
        <p className="mt-4 text-center text-xs text-ink-500">
          No grabamos las llamadas. Nunca compartas datos personales, cuentas ni
          dinero con desconocidos.
        </p>
      )}

      {reporting && (
        <ReportDialog
          onClose={() => setReporting(false)}
          onSubmit={(reason, note) => {
            parlo.report(reason, note);
            setReporting(false);
          }}
        />
      )}
    </main>
  );
}
