import http from "node:http";
import { randomUUID } from "node:crypto";
import { WebSocketServer, WebSocket } from "ws";
import {
  clientMessageSchema,
  type Prefs,
  type Profile,
  type PublicProfile,
  type ServerMessage,
} from "@parlo/protocol";
import { config } from "./config.js";
import { initStore, store } from "./db.js";
import { findPairings, pruneRecentPairs, type Waiter } from "./matcher.js";
import {
  RateLimiter,
  isBanned,
  issueDeviceToken,
  submitReport,
  verifyAgeToken,
  verifyDeviceToken,
} from "./safety.js";

interface Session {
  id: string;
  ws: WebSocket;
  deviceId: string;
  region?: string;
  ageVerified: boolean;
  profile?: Profile;
  prefs?: Prefs;
  roomId?: string;
  queuedAt?: number;
  alive: boolean;
  limits: {
    messages: RateLimiter;
    chat: RateLimiter;
  };
}

interface Room {
  id: string;
  a: string;
  b: string;
  startedAt: number;
  /** Epoch ms the conversation ends; Infinity once it goes unlimited. */
  endsAt: number;
  /** Session ids that have asked to continue THIS round. */
  wantMore: Set<string>;
  /** How many times both sides have agreed to carry on. */
  round: number;
}

const sessions = new Map<string, Session>();
const rooms = new Map<string, Room>();

/* ----------------------------- helpers ---------------------------- */

function send(session: Session, msg: ServerMessage) {
  if (session.ws.readyState === WebSocket.OPEN) {
    session.ws.send(JSON.stringify(msg));
  }
}

function fail(session: Session, code: string, message: string) {
  send(session, { t: "error", code, message });
}

function peerOf(session: Session): Session | undefined {
  if (!session.roomId) return undefined;
  const room = rooms.get(session.roomId);
  if (!room) return undefined;
  const peerId = room.a === session.id ? room.b : room.a;
  return sessions.get(peerId);
}

function publicProfile(s: Session, viewer: Session): PublicProfile {
  const p = s.profile!;
  return {
    displayName: p.displayName,
    speaks: p.speaks,
    learning: p.learning,
    level: p.level,
    gender: p.gender,
    region: s.region,
    international: Boolean(s.region && viewer.region && s.region !== viewer.region),
  };
}

function queued(): Waiter[] {
  const out: Waiter[] = [];
  for (const s of sessions.values()) {
    if (s.queuedAt && !s.roomId && s.profile && s.prefs) {
      out.push({
        sessionId: s.id,
        deviceId: s.deviceId,
        profile: s.profile,
        prefs: s.prefs,
        since: s.queuedAt,
      });
    }
  }
  return out;
}

/** Tear down a room and tell the other side why. */
function closeRoom(
  roomId: string,
  reason: "skip" | "disconnect" | "reported" | "timeout",
  initiator?: string,
) {
  const room = rooms.get(roomId);
  if (!room) return;
  rooms.delete(roomId);

  for (const id of [room.a, room.b]) {
    const s = sessions.get(id);
    if (!s) continue;
    s.roomId = undefined;
    if (id !== initiator) send(s, { t: "peer-left", reason });
  }
}

function enterQueue(session: Session) {
  session.queuedAt = Date.now();
  send(session, { t: "queued", waiting: queued().length });
}

/** Tell both sides where the clock stands and who has asked to stay. */
function broadcastTimer(room: Room) {
  for (const id of [room.a, room.b]) {
    const s = sessions.get(id);
    if (!s) continue;
    const peerId = room.a === id ? room.b : room.a;
    send(s, {
      t: "timer",
      endsAt: room.endsAt,
      youWant: room.wantMore.has(id),
      peerWants: room.wantMore.has(peerId),
      round: room.round,
    });
  }
}

/**
 * Expire conversations nobody asked to keep. Both sides go straight
 * back into the queue: the whole point of a timer is that leaving is
 * the default, so nobody has to be the one who ends it.
 */
setInterval(() => {
  const now = Date.now();
  for (const room of [...rooms.values()]) {
    if (now < room.endsAt) continue;
    const members = [room.a, room.b]
      .map((id) => sessions.get(id))
      .filter((s): s is Session => Boolean(s));
    closeRoom(room.id, "timeout");
    for (const s of members) if (s.profile && s.prefs) enterQueue(s);
  }
}, 1_000);

/* ------------------------------ matcher --------------------------- */

setInterval(() => {
  const pairings = findPairings(queued());

  for (const { a, b } of pairings) {
    const sa = sessions.get(a.sessionId);
    const sb = sessions.get(b.sessionId);
    if (!sa || !sb) continue;

    const roomId = randomUUID();
    const endsAt = Date.now() + config.session.initialMs;
    rooms.set(roomId, {
      id: roomId,
      a: sa.id,
      b: sb.id,
      startedAt: Date.now(),
      endsAt,
      wantMore: new Set(),
      round: 0,
    });
    sa.roomId = sb.roomId = roomId;
    sa.queuedAt = sb.queuedAt = undefined;

    const iceServers = config.iceServers();

    // Perfect negotiation needs exactly one polite peer; the server is
    // the only party that can assign that without a race.
    send(sa, { t: "matched", roomId, peer: publicProfile(sb, sa), polite: true, iceServers, endsAt });
    send(sb, { t: "matched", roomId, peer: publicProfile(sa, sb), polite: false, iceServers, endsAt });
  }
}, config.tickMs);

setInterval(pruneRecentPairs, 60_000);

/** Broadcast live counts so the lobby doesn't look dead. */
setInterval(() => {
  const stats: ServerMessage = {
    t: "stats",
    online: sessions.size,
    waiting: queued().length,
  };
  for (const s of sessions.values()) send(s, stats);
}, 5_000);

/* ---------------------------- heartbeat --------------------------- */

setInterval(() => {
  for (const s of sessions.values()) {
    if (!s.alive) {
      s.ws.terminate();
      continue;
    }
    s.alive = false;
    send(s, { t: "ping" });
  }
}, config.heartbeatMs);

/* ------------------------------ server ---------------------------- */

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true, sessions: sessions.size, rooms: rooms.size }));
    return;
  }
  res.writeHead(404).end();
});

// Cap the frame before it ever reaches JSON.parse or zod. `ws`
// defaults to 100MB, which hands an unauthenticated caller a trivial
// memory-exhaustion lever. The largest legitimate message here is a
// 2000-char chat line plus envelope; 64KB is already generous.
const wss = new WebSocketServer({ noServer: true, maxPayload: 64 * 1024 });

server.on("upgrade", (req, socket, head) => {
  const origin = req.headers.origin;
  const allowed =
    config.allowedOrigins.includes("*") ||
    (origin !== undefined && config.allowedOrigins.includes(origin));

  if (!allowed) {
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req));
});

wss.on("connection", (ws, req) => {
  const region =
    (req.headers["cf-ipcountry"] as string | undefined) ??
    (req.headers["x-vercel-ip-country"] as string | undefined);

  const session: Session = {
    id: randomUUID(),
    ws,
    deviceId: "",
    region: region && region.length === 2 ? region.toUpperCase() : undefined,
    ageVerified: false,
    alive: true,
    limits: {
      messages: new RateLimiter(config.rateLimit.messagesPer10s, 10_000),
      chat: new RateLimiter(config.rateLimit.chatPer10s, 10_000),
    },
  };

  ws.on("message", async (raw) => {
    if (!session.limits.messages.take()) {
      fail(session, "rate_limited", "Slow down.");
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw.toString());
    } catch {
      fail(session, "bad_json", "Malformed message.");
      return;
    }

    const result = clientMessageSchema.safeParse(parsed);
    if (!result.success) {
      fail(session, "bad_message", "Message failed validation.");
      return;
    }
    const msg = result.data;

    // Everything except the handshake requires an established session.
    if (msg.t !== "hello" && !session.deviceId) {
      fail(session, "no_handshake", "Send hello first.");
      return;
    }

    switch (msg.t) {
      case "hello": {
        // Reuse the caller's device identity when it verifies, so bans
        // and strikes survive a reconnect; otherwise mint a fresh one.
        let token = msg.deviceToken;
        let deviceId = verifyDeviceToken(token);
        if (!deviceId) {
          token = issueDeviceToken();
          deviceId = verifyDeviceToken(token)!;
        }
        session.deviceId = deviceId;

        const banned = await isBanned(session.deviceId);
        if (banned) {
          send(session, { t: "banned", until: banned.until, reason: banned.reason });
          ws.close();
          return;
        }

        try {
          session.ageVerified = await verifyAgeToken(msg.ageToken);
        } catch (err) {
          fail(session, "age_provider_unavailable", (err as Error).message);
          ws.close();
          return;
        }

        sessions.set(session.id, session);
        send(session, {
          t: "ready",
          sessionId: session.id,
          deviceToken: token!,
          region: session.region,
        });
        break;
      }

      case "queue": {
        if (!session.ageVerified) {
          fail(session, "age_required", "Age verification required.");
          return;
        }
        const banned = await isBanned(session.deviceId);
        if (banned) {
          send(session, { t: "banned", until: banned.until, reason: banned.reason });
          ws.close();
          return;
        }
        if (session.roomId) closeRoom(session.roomId, "skip", session.id);

        session.profile = msg.profile;
        session.prefs = msg.prefs;
        enterQueue(session);
        break;
      }

      case "dequeue":
        session.queuedAt = undefined;
        break;

      case "skip": {
        if (session.roomId) closeRoom(session.roomId, "skip", session.id);
        enterQueue(session);
        break;
      }

      case "signal": {
        // Relayed verbatim: SDP and ICE are opaque to the server, which
        // is the point — the server never sees or touches media.
        const peer = peerOf(session);
        if (peer) send(peer, { t: "signal", payload: msg.payload });
        break;
      }

      case "chat": {
        if (!session.limits.chat.take()) {
          fail(session, "rate_limited", "Too many messages.");
          return;
        }
        const peer = peerOf(session);
        if (peer) send(peer, { t: "chat", text: msg.text, at: Date.now() });
        break;
      }

      case "typing": {
        const peer = peerOf(session);
        if (peer) send(peer, { t: "typing", on: msg.on });
        break;
      }

      case "extend": {
        const room = session.roomId ? rooms.get(session.roomId) : undefined;
        if (!room) {
          fail(session, "no_room", "Nothing to extend.");
          return;
        }
        room.wantMore.add(session.id);

        // One-sided interest is never enough. Staying has to be a
        // decision both people make, or the countdown is theatre.
        const bothWant = room.wantMore.has(room.a) && room.wantMore.has(room.b);
        if (bothWant) {
          room.round += 1;
          room.wantMore.clear();
          room.endsAt =
            room.round >= config.session.unlimitedAfterRounds
              ? Number.MAX_SAFE_INTEGER
              : Date.now() + config.session.extendMs;
        }
        broadcastTimer(room);
        break;
      }

      case "react": {
        const peer = peerOf(session);
        if (peer) send(peer, { t: "react", reaction: msg.reaction });
        break;
      }

      case "report": {
        const peer = peerOf(session);
        if (!peer || !session.roomId) {
          fail(session, "no_peer", "Nothing to report.");
          return;
        }

        // Capture before awaiting: the peer can disconnect mid-write,
        // which clears session.roomId out from under us.
        const roomId = session.roomId;
        const accusedDeviceId = peer.deviceId;

        const outcome = await submitReport({
          roomId,
          reporterDeviceId: session.deviceId,
          accusedDeviceId,
          reason: msg.reason,
          note: msg.note,
        });

        // The reporter leaves this conversation either way — they asked
        // to, and holding them there while we argue about duplicates
        // would be the wrong answer to "this person is harassing me".
        closeRoom(roomId, "reported", session.id);

        if (!outcome.accepted) {
          fail(
            session,
            outcome.code,
            outcome.code === "duplicate"
              ? "Ya habías reportado esta conversación."
              : outcome.code === "rate_limited"
                ? "Demasiados reportes. Inténtalo más tarde."
                : "No pudimos registrar el reporte. Vuelve a intentarlo.",
          );
        } else if (outcome.banned) {
          send(peer, {
            t: "banned",
            until: outcome.until!,
            reason: "Account suspended pending review.",
          });
          peer.ws.close();
        }

        enterQueue(session);
        break;
      }

      case "pong":
        session.alive = true;
        break;
    }
  });

  ws.on("close", () => {
    if (session.roomId) closeRoom(session.roomId, "disconnect", session.id);
    sessions.delete(session.id);
  });

  ws.on("error", () => {
    if (session.roomId) closeRoom(session.roomId, "disconnect", session.id);
    sessions.delete(session.id);
  });
});

/* ---------------------------- lifecycle --------------------------- */

// The moderation store comes up BEFORE the socket does. Accepting
// connections while ban enforcement is unavailable is the one startup
// race worth refusing to run through.
try {
  await initStore();
} catch {
  console.error("[parlo] refusing to start without a working moderation store.");
  process.exit(1);
}

server.listen(config.port, () => {
  console.log(`[parlo] signal server on :${config.port} (store: ${store.kind})`);
  if (!config.requireAgeToken) {
    console.warn("[parlo] REQUIRE_AGE_TOKEN is not set — development only. See LEGAL.md §2.");
  }
  if (config.allowedOrigins.includes("*")) {
    console.warn("[parlo] ALLOWED_ORIGINS is '*' — development only.");
  }
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    console.log(`\n[parlo] ${signal} — shutting down`);
    server.close();
    for (const s of sessions.values()) s.ws.close();
    void store.close().finally(() => process.exit(0));
  });
}
