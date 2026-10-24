"use client";

import { useEffect, useRef } from "react";

function Tile({
  stream,
  muted,
  label,
  mirrored,
}: {
  stream: MediaStream | null;
  muted?: boolean;
  label: string;
  mirrored?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.srcObject !== stream) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-900">
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={muted}
        className={`size-full object-cover ${mirrored ? "-scale-x-100" : ""}`}
      />
      {!stream && (
        <div className="absolute inset-0 grid place-items-center text-sm text-ink-500">
          Sin señal
        </div>
      )}
      <span className="absolute bottom-2.5 left-2.5 rounded-md bg-ink-950/70 px-2 py-1 text-xs font-medium backdrop-blur">
        {label}
      </span>
    </div>
  );
}

export function VideoStage({
  local,
  remote,
  peerName,
}: {
  local: MediaStream | null;
  remote: MediaStream | null;
  peerName: string;
}) {
  return (
    <div className="grid flex-1 grid-rows-2 gap-3 sm:grid-cols-2 sm:grid-rows-1">
      <Tile stream={remote} label={peerName} />
      <Tile stream={local} muted label="Tú" mirrored />
    </div>
  );
}
