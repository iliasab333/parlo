/**
 * End-to-end smoke test against a running signal server.
 * Spins up synthetic clients and asserts the matcher pairs them
 * correctly, honours gender preferences, and relays chat.
 */
import { WebSocket } from "ws";

const URL = process.env.SIGNAL_URL ?? "ws://localhost:8787";
const results = [];
function check(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

class Client {
  constructor(label) {
    this.label = label;
    this.inbox = [];
    this.waiters = [];
  }
  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(URL, { origin: "http://localhost:3000" });
      this.ws.on("message", (raw) => {
        const msg = JSON.parse(raw.toString());
        if (msg.t === "ping") return this.ws.send(JSON.stringify({ t: "pong" }));
        this.inbox.push(msg);
        for (const w of [...this.waiters]) {
          if (w.type === msg.t) {
            this.waiters.splice(this.waiters.indexOf(w), 1);
            w.resolve(msg);
          }
        }
      });
      this.ws.on("open", () => { this.ws.send(JSON.stringify({ t: "hello" })); resolve(); });
      this.ws.on("error", reject);
    });
  }
  wait(type, ms = 4000) {
    const found = this.inbox.find((m) => m.t === type);
    if (found) return Promise.resolve(found);
    return new Promise((resolve, reject) => {
      const w = { type, resolve };
      this.waiters.push(w);
      setTimeout(() => {
        if (this.waiters.includes(w)) {
          this.waiters.splice(this.waiters.indexOf(w), 1);
          reject(new Error(`${this.label}: timeout waiting for "${type}"`));
        }
      }, ms);
    });
  }
  send(msg) { this.ws.send(JSON.stringify(msg)); }
  close() { this.ws.close(); }
  clear() { this.inbox = []; }
}

const profile = (over = {}) => ({
  speaks: ["es"], learning: ["en"], level: "intermediate",
  gender: "undisclosed", ...over,
});
const prefs = (over = {}) => ({
  genders: ["female", "male", "nonbinary", "undisclosed"],
  targetLanguages: [], preferInternational: false, ...over,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  // --- 1. complementary pair matches -------------------------------
  const a = new Client("A"), b = new Client("B");
  await Promise.all([a.connect(), b.connect()]);
  await Promise.all([a.wait("ready"), b.wait("ready")]);

  a.send({ t: "queue", profile: profile({ speaks: ["es"], learning: ["en"], displayName: "Ana" }), prefs: prefs() });
  b.send({ t: "queue", profile: profile({ speaks: ["en"], learning: ["es"], displayName: "Ben" }), prefs: prefs() });

  const [ma, mb] = await Promise.all([a.wait("matched"), b.wait("matched")]);
  check("complementary speakers are matched", ma.roomId === mb.roomId, `room ${ma.roomId.slice(0, 8)}`);
  check("peer profile is exposed", ma.peer.displayName === "Ben" && mb.peer.displayName === "Ana");
  check("exactly one peer is polite", ma.polite !== mb.polite);

  // --- 2. chat relay -----------------------------------------------
  a.send({ t: "chat", text: "¡Hola! ¿De dónde eres?" });
  const line = await b.wait("chat");
  check("chat is relayed to the peer", line.text === "¡Hola! ¿De dónde eres?");

  // --- 3. skip notifies the other side ------------------------------
  b.clear();
  a.send({ t: "skip" });
  const left = await b.wait("peer-left");
  check("skip notifies the abandoned peer", left.reason === "skip");

  a.close(); b.close();
  await sleep(300);

  // --- 4. gender preference is enforced in both directions ----------
  const c = new Client("C"), d = new Client("D");
  await Promise.all([c.connect(), d.connect()]);
  await Promise.all([c.wait("ready"), d.wait("ready")]);

  // C only wants to talk to women; D is male -> must never match.
  c.send({ t: "queue", profile: profile({ gender: "male" }), prefs: prefs({ genders: ["female"] }) });
  d.send({ t: "queue", profile: profile({ gender: "male", speaks: ["en"], learning: ["es"] }), prefs: prefs() });

  await sleep(1500);
  const matchedAnyway = c.inbox.some((m) => m.t === "matched") || d.inbox.some((m) => m.t === "matched");
  check("incompatible gender preference blocks the match", !matchedAnyway);

  // A compatible woman joins -> C should match her, not D.
  const e = new Client("E");
  await e.connect();
  await e.wait("ready");
  e.send({ t: "queue", profile: profile({ gender: "female", speaks: ["en"], learning: ["es"], displayName: "Eva" }), prefs: prefs() });

  const mc = await c.wait("matched");
  check("a compatible partner is matched once available", mc.peer.displayName === "Eva", `got ${mc.peer.displayName}`);
  check("the filtered-out peer stays queued", !d.inbox.some((m) => m.t === "matched"));

  c.close(); d.close(); e.close();

  // --- 5. validation rejects malformed input ------------------------
  const f = new Client("F");
  await f.connect();
  await f.wait("ready");
  f.send({ t: "queue", profile: { speaks: [], learning: [] }, prefs: prefs() });
  const err = await f.wait("error");
  check("malformed payloads are rejected", err.code === "bad_message");
  f.close();

  await sleep(200);
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => { console.error("\nFATAL:", err.message); process.exit(1); });
