"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  LANGUAGE_NAMES,
  type Language,
  type Prefs,
  type Profile,
  type PublicProfile,
} from "@parlo/protocol";
import { fill, type Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { useParlo } from "@/lib/useParlo";
import { AgeGate } from "@/components/AgeGate";
import { SetupPanel } from "@/components/SetupPanel";
import { VideoStage } from "@/components/VideoStage";
import { ChatPane } from "@/components/ChatPane";
import { ReportDialog } from "@/components/ReportDialog";
import { SessionClock } from "@/components/SessionClock";
import { ReactionBar, FloatingReactions } from "@/components/Reactions";

function PeerCard({ t, peer }: { t: Dictionary; peer: PublicProfile }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span className="font-semibold">{peer.displayName ?? t.session.anonymous}</span>
      {peer.region && (
        <span className="rounded-md bg-ink-800 px-2 py-0.5 text-xs text-ink-300">
          {peer.region}
        </span>
      )}
      {peer.international && (
        <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs text-accent">
          {t.session.international}
        </span>
      )}
      <span className="text-xs text-ink-500">
        {t.session.speaks} {peer.speaks.map((l) => LANGUAGE_NAMES[l]).join(", ")} ·{" "}
        {t.session.practises} {peer.learning.map((l) => LANGUAGE_NAMES[l]).join(", ")}
      </span>
    </div>
  );
}

export function ChatClient({ t, locale }: { t: Dictionary; locale: Locale }) {
  // The hook must not carry a language of its own, so the strings it
  // emits are handed in. Memoised: it is an effect dependency.
  const strings = useMemo(
    () => ({ peerLeft: t.peerLeft, errors: t.errors }),
    [t.peerLeft, t.errors],
  );
  const parlo = useParlo(strings);
  const [ageOk, setAgeOk] = useState(false);
  const [reporting, setReporting] = useState(false);
  // On a phone the chat is a sheet, not a column: a video call needs
  // the height more than an empty message list does.
  const [chatOpen, setChatOpen] = useState(false);
  const [seenCount, setSeenCount] = useState(0);

  const unread = chatOpen ? 0 : Math.max(0, parlo.messages.length - seenCount);
  useEffect(() => {
    if (chatOpen) setSeenCount(parlo.messages.length);
  }, [chatOpen, parlo.messages.length]);

  const inSession = parlo.status === "queued" || parlo.status === "matched";

  function handleStart(profile: Profile, prefs: Prefs) {
    void parlo.start(profile, prefs);
  }

  if (parlo.status === "banned") {
    return (
      <main className="grid min-h-dvh place-items-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">{t.banned.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">{parlo.error}</p>
          <p className="mt-4 text-xs text-ink-500">
            {fill(t.banned.appeal, { email: site.supportEmail })}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-dvh max-w-6xl flex-col px-5 py-5">
      {!ageOk && <AgeGate t={t} onConfirm={() => setAgeOk(true)} />}

      <header className="mb-5 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-lg bg-accent/15 text-accent">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-4.3-1L3 20l1.3-4a8.2 8.2 0 0 1-1.1-4.5 8.4 8.4 0 0 1 8.9-8.4 8.4 8.4 0 0 1 8.9 8.4Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* The wordmark wraps to two lines on a phone and costs more
              height than it earns during a call. */}
          <span className="hidden font-semibold tracking-tight sm:inline">{site.name}</span>
        </Link>

        <div className="flex items-center gap-4 text-xs text-ink-500">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent" />
            {parlo.stats.online} {t.common.online}
          </span>
          <span>
            {parlo.stats.waiting} {t.common.searching}
          </span>
        </div>
      </header>

      {parlo.error && (
        <div className="mb-4 rounded-xl border border-danger/40 bg-danger/10 px-4 py-2.5 text-sm text-ink-100">
          {parlo.error}
        </div>
      )}

      {(parlo.status === "idle" || parlo.status === "connecting") && (
        <div className="scroll-slim flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl rounded-2xl border border-ink-800 bg-ink-900/50 p-7">
            <h1 className="text-xl font-semibold">{t.setup.title}</h1>
            <p className="mb-7 mt-1.5 text-sm text-ink-500">
              {parlo.status === "connecting" ? t.setup.connecting : t.setup.lede}
            </p>
            <SetupPanel
              t={t}
              locale={locale}
              disabled={parlo.status !== "idle"}
              onStart={handleStart}
            />
          </div>
        </div>
      )}

      {parlo.status === "queued" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <div className="pulse-ring relative size-16 rounded-full bg-accent/15" />
          <div className="text-center">
            <p className="font-medium">{t.queue.title}</p>
            <p className="mt-1.5 max-w-sm text-sm text-ink-500">{t.queue.note}</p>
          </div>
          <button
            onClick={parlo.stop}
            className="rounded-xl border border-ink-700 px-5 py-2.5 text-sm font-medium text-ink-300 hover:border-ink-500"
          >
            {t.queue.cancel}
          </button>
        </div>
      )}

      {parlo.status === "matched" && parlo.peer && (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <PeerCard t={t} peer={parlo.peer} />
            <div className="flex flex-wrap items-center gap-2">
              {parlo.timer && (
                <SessionClock t={t} timer={parlo.timer} onExtend={parlo.extend} />
              )}
              <button
                onClick={() => setReporting(true)}
                aria-label={t.session.report}
                title={t.session.report}
                className="grid size-9 place-items-center rounded-lg border border-ink-700 text-ink-300 transition hover:border-danger hover:text-danger sm:size-auto sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <svg viewBox="0 0 24 24" className="size-4 sm:hidden" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 15V4h16l-3 4 3 4H4m0 0v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="hidden sm:inline">{t.session.report}</span>
              </button>
              <button
                onClick={parlo.skip}
                aria-label={t.session.next}
                title={t.session.next}
                className="grid size-9 place-items-center rounded-lg bg-ink-800 font-medium transition hover:bg-ink-700 sm:size-auto sm:px-4 sm:py-2 sm:text-sm"
              >
                <svg viewBox="0 0 24 24" className="size-4 sm:hidden" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m5 5 9 7-9 7V5Zm13 0v14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="hidden sm:inline">{t.session.next}</span>
              </button>
              <button
                onClick={parlo.stop}
                aria-label={t.session.exit}
                title={t.session.exit}
                className="grid size-9 place-items-center rounded-lg border border-ink-700 text-ink-300 hover:border-ink-500 sm:size-auto sm:px-3.5 sm:py-2 sm:text-sm"
              >
                <svg viewBox="0 0 24 24" className="size-4 sm:hidden" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 19H5V5h5m5 10 4-3-4-3m4 3H9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="hidden sm:inline">{t.session.exit}</span>
              </button>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
            <div className="relative flex min-h-0 flex-col gap-3">
              <VideoStage
                t={t}
                local={parlo.localStream}
                remote={parlo.remoteStream}
                peerName={parlo.peer.displayName ?? t.session.anonymous}
              />
              <FloatingReactions items={parlo.reactions} />

              <div className="flex items-center justify-center gap-2">
                <ReactionBar onReact={parlo.react} />
                <button
                  onClick={() => setChatOpen(true)}
                  aria-label={t.chat.placeholder}
                  className="relative grid size-9 shrink-0 place-items-center rounded-lg border border-ink-700 text-ink-300 transition hover:border-accent hover:text-accent lg:hidden"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-4.3-1L3 20l1.3-4a8.2 8.2 0 0 1-1.1-4.5 8.4 8.4 0 0 1 8.9-8.4 8.4 8.4 0 0 1 8.9 8.4Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {unread > 0 && (
                    <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-ink-950">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Sheet below lg, ordinary column above it. */}
            {chatOpen && (
              <button
                aria-label={t.report.cancel}
                onClick={() => setChatOpen(false)}
                className="fixed inset-0 z-30 bg-ink-950/60 backdrop-blur-sm lg:hidden"
              />
            )}
            <div
              className={`${
                chatOpen
                  ? "fixed inset-x-0 bottom-0 z-40 h-[70dvh] p-3"
                  : "hidden"
              } lg:static lg:z-auto lg:block lg:h-auto lg:p-0`}
            >
              <div className="flex h-full min-h-0 flex-col">
                <button
                  onClick={() => setChatOpen(false)}
                  className="mx-auto mb-2 h-1 w-10 shrink-0 rounded-full bg-ink-700 lg:hidden"
                  aria-label={t.report.cancel}
                />
                <ChatPane
                  t={t}
                  messages={parlo.messages}
                  peerTyping={parlo.peerTyping}
                  disabled={false}
                  onSend={parlo.sendChat}
                  onTyping={parlo.setTyping}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {inSession && (
        <p className="mt-4 hidden text-center text-xs text-ink-500 sm:block">
          {t.session.privacyNote}
        </p>
      )}

      {reporting && (
        <ReportDialog
          t={t}
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

export type { Language };
