"use client";

import { useEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries";

function useStream(stream: MediaStream | null) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.srcObject !== stream) {
      ref.current.srcObject = stream;
    }
  }, [stream]);
  return ref;
}

/**
 * The other person fills the frame; you are a thumbnail on top of it.
 *
 * Two equal tiles stacked is what a desktop layout does to a phone:
 * with the header, the clock, the reaction bar and the chat all asking
 * for height, neither video ended up big enough to read a face. Every
 * video-call product converges on remote-full + local-PiP for the same
 * reason — the conversation is with THEM, and your own camera only has
 * to answer "is my face in shot".
 */
export function VideoStage({
  t,
  local,
  remote,
  peerName,
}: {
  t: Dictionary;
  local: MediaStream | null;
  remote: MediaStream | null;
  peerName: string;
}) {
  const remoteRef = useStream(remote);
  const localRef = useStream(local);

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-ink-800 bg-ink-900">
      <video
        ref={remoteRef}
        autoPlay
        playsInline
        className="size-full object-cover"
      />

      {!remote && (
        <div className="absolute inset-0 grid place-items-center text-sm text-ink-500">
          {t.session.noSignal}
        </div>
      )}

      <span className="absolute left-3 top-3 rounded-lg bg-ink-950/70 px-2.5 py-1 text-xs font-medium backdrop-blur">
        {peerName}
      </span>

      {/* Sits above the reaction bar so a drifting emoji never lands on
          your own face, and stays clear of the bottom safe area. */}
      <div className="absolute bottom-3 right-3 w-24 overflow-hidden rounded-xl border border-ink-700 bg-ink-950 shadow-lg sm:w-32">
        <video
          ref={localRef}
          autoPlay
          playsInline
          muted
          className="aspect-[3/4] w-full -scale-x-100 object-cover"
        />
        <span className="absolute bottom-1 left-1.5 text-[10px] font-medium text-ink-100/90 drop-shadow">
          {t.session.you}
        </span>
      </div>
    </div>
  );
}
