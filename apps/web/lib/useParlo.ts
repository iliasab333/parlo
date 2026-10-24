"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ClientMessage,
  IceServer,
  Prefs,
  Profile,
  PublicProfile,
  ServerMessage,
} from "@parlo/protocol";

const SIGNAL_URL =
  process.env.NEXT_PUBLIC_SIGNAL_URL ?? "ws://localhost:8787";
const DEVICE_TOKEN_KEY = "parlo.deviceToken";

export type Status =
  | "connecting"
  | "idle"
  | "queued"
  | "matched"
  | "banned"
  | "error";

export interface ChatLine {
  id: string;
  from: "me" | "them" | "system";
  text: string;
  at: number;
}

export interface ParloState {
  status: Status;
  error: string | null;
  peer: PublicProfile | null;
  region?: string;
  messages: ChatLine[];
  stats: { online: number; waiting: number };
  peerTyping: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

export function useParlo() {
  const [state, setState] = useState<ParloState>({
    status: "connecting",
    error: null,
    peer: null,
    messages: [],
    stats: { online: 0, waiting: 0 },
    peerTyping: false,
    localStream: null,
    remoteStream: null,
  });

  const ws = useRef<WebSocket | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const polite = useRef(true);
  const makingOffer = useRef(false);
  const ignoreOffer = useRef(false);

  const push = useCallback((line: Omit<ChatLine, "id">) => {
    setState((s) => ({
      ...s,
      messages: [...s.messages, { ...line, id: crypto.randomUUID() }],
    }));
  }, []);

  const send = useCallback((msg: ClientMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    }
  }, []);

  /* ----------------------------- WebRTC ---------------------------- */

  const teardownPeer = useCallback(() => {
    pc.current?.close();
    pc.current = null;
    makingOffer.current = false;
    ignoreOffer.current = false;
    setState((s) => ({ ...s, remoteStream: null, peerTyping: false }));
  }, []);

  const createPeer = useCallback(
    (iceServers: IceServer[], isPolite: boolean) => {
      teardownPeer();
      polite.current = isPolite;

      const conn = new RTCPeerConnection({
        iceServers: iceServers as RTCIceServer[],
      });
      pc.current = conn;

      const remote = new MediaStream();
      setState((s) => ({ ...s, remoteStream: remote }));

      conn.ontrack = ({ track }) => {
        remote.addTrack(track);
        // Re-set to force a re-render with the populated stream.
        setState((s) => ({ ...s, remoteStream: remote }));
      };

      conn.onicecandidate = ({ candidate }) => {
        if (candidate) send({ t: "signal", payload: { candidate } });
      };

      // Perfect negotiation: both sides may fire this, and the polite
      // peer rolls back on collision rather than deadlocking.
      conn.onnegotiationneeded = async () => {
        try {
          makingOffer.current = true;
          await conn.setLocalDescription();
          send({ t: "signal", payload: { description: conn.localDescription } });
        } catch (err) {
          console.error("negotiation failed", err);
        } finally {
          makingOffer.current = false;
        }
      };

      if (localStream.current) {
        for (const track of localStream.current.getTracks()) {
          conn.addTrack(track, localStream.current);
        }
      }

      return conn;
    },
    [send, teardownPeer],
  );

  const handleSignal = useCallback(
    async (payload: { description?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit }) => {
      const conn = pc.current;
      if (!conn) return;

      try {
        if (payload.description) {
          const collision =
            payload.description.type === "offer" &&
            (makingOffer.current || conn.signalingState !== "stable");

          ignoreOffer.current = !polite.current && collision;
          if (ignoreOffer.current) return;

          await conn.setRemoteDescription(payload.description);
          if (payload.description.type === "offer") {
            await conn.setLocalDescription();
            send({ t: "signal", payload: { description: conn.localDescription } });
          }
        } else if (payload.candidate) {
          try {
            await conn.addIceCandidate(payload.candidate);
          } catch (err) {
            if (!ignoreOffer.current) throw err;
          }
        }
      } catch (err) {
        console.error("signal handling failed", err);
      }
    },
    [send],
  );

  /* --------------------------- connection -------------------------- */

  useEffect(() => {
    // A ws:// socket on an https:// page is blocked as mixed content,
    // and the browser's own error is nearly silent. Catching the
    // misconfiguration here turns a deployment mistake into a sentence
    // someone can act on.
    if (window.location.protocol === "https:" && SIGNAL_URL.startsWith("ws://")) {
      setState((s) => ({
        ...s,
        status: "error",
        error:
          "Configuración incompleta: NEXT_PUBLIC_SIGNAL_URL apunta a ws:// desde una página https. El servidor de señalización necesita wss://.",
      }));
      return;
    }

    // StrictMode mounts effects twice in development: the first socket is
    // torn down mid-handshake, and its close/error handlers must not
    // write state that outlives it.
    let disposed = false;

    const socket = new WebSocket(SIGNAL_URL);
    ws.current = socket;

    socket.onopen = () => {
      const stored = localStorage.getItem(DEVICE_TOKEN_KEY) ?? undefined;
      socket.send(JSON.stringify({ t: "hello", deviceToken: stored } satisfies ClientMessage));
    };

    socket.onmessage = (ev) => {
      const msg: ServerMessage = JSON.parse(ev.data);

      switch (msg.t) {
        case "ready":
          localStorage.setItem(DEVICE_TOKEN_KEY, msg.deviceToken);
          setState((s) => ({ ...s, status: "idle", error: null, region: msg.region }));
          break;

        case "queued":
          setState((s) => ({ ...s, status: "queued", peer: null, messages: [] }));
          break;

        case "matched":
          setState((s) => ({ ...s, status: "matched", peer: msg.peer, messages: [] }));
          createPeer(msg.iceServers, msg.polite);
          break;

        case "signal":
          void handleSignal(msg.payload as never);
          break;

        case "chat":
          setState((s) => ({
            ...s,
            peerTyping: false,
            messages: [
              ...s.messages,
              { id: crypto.randomUUID(), from: "them", text: msg.text, at: msg.at },
            ],
          }));
          break;

        case "typing":
          setState((s) => ({ ...s, peerTyping: msg.on }));
          break;

        case "peer-left":
          teardownPeer();
          setState((s) => ({ ...s, peer: null }));
          push({
            from: "system",
            at: Date.now(),
            text:
              msg.reason === "skip"
                ? "Tu compañero pasó a otra conversación."
                : msg.reason === "reported"
                  ? "Conversación finalizada."
                  : "Tu compañero se desconectó.",
          });
          break;

        case "stats":
          setState((s) => ({ ...s, stats: { online: msg.online, waiting: msg.waiting } }));
          break;

        case "banned":
          setState((s) => ({ ...s, status: "banned", error: msg.reason }));
          break;

        case "error":
          setState((s) => ({ ...s, error: msg.message }));
          break;

        case "ping":
          socket.send(JSON.stringify({ t: "pong" } satisfies ClientMessage));
          break;
      }
    };

    socket.onerror = () => {
      if (disposed) return;
      setState((s) => ({
        ...s,
        status: "error",
        error: "No se pudo conectar al servidor de emparejamiento.",
      }));
    };

    socket.onclose = () => {
      if (disposed) return;
      setState((s) =>
        s.status === "banned" ? s : { ...s, status: "error", error: "Conexión cerrada." },
      );
    };

    return () => {
      disposed = true;
      socket.close();
      pc.current?.close();
      localStream.current?.getTracks().forEach((t) => t.stop());
    };
  }, [createPeer, handleSignal, push, teardownPeer]);

  /* ----------------------------- actions --------------------------- */

  const start = useCallback(
    async (profile: Profile, prefs: Prefs) => {
      setState((s) => ({ ...s, error: null }));

      if (!localStream.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: { echoCancellation: true, noiseSuppression: true },
          });
          localStream.current = stream;
          setState((s) => ({ ...s, localStream: stream }));
        } catch {
          setState((s) => ({
            ...s,
            error:
              "Parlo necesita cámara y micrófono. Revisa los permisos del navegador y vuelve a intentarlo.",
          }));
          return;
        }
      }

      send({ t: "queue", profile, prefs });
    },
    [send],
  );

  const skip = useCallback(() => {
    teardownPeer();
    send({ t: "skip" });
  }, [send, teardownPeer]);

  const stop = useCallback(() => {
    teardownPeer();
    send({ t: "dequeue" });
    localStream.current?.getTracks().forEach((t) => t.stop());
    localStream.current = null;
    setState((s) => ({ ...s, status: "idle", peer: null, localStream: null, messages: [] }));
  }, [send, teardownPeer]);

  const sendChat = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      send({ t: "chat", text: trimmed });
      push({ from: "me", text: trimmed, at: Date.now() });
    },
    [push, send],
  );

  const setTyping = useCallback((on: boolean) => send({ t: "typing", on }), [send]);

  const report = useCallback(
    (reason: "nudity" | "minor" | "harassment" | "spam" | "violence" | "other", note?: string) => {
      send({ t: "report", reason, note });
      teardownPeer();
    },
    [send, teardownPeer],
  );

  return { ...state, start, skip, stop, sendChat, setTyping, report };
}
