/**
 * Timed-session and reaction tests.
 *
 * Expects a signal server started with a short clock, e.g.:
 *   PORT=8789 SESSION_MS=6000 SESSION_EXTEND_MS=8000 \
 *   SESSION_UNLIMITED_AFTER=2 npm run dev:signal
 */
import { WebSocket } from "ws";

const URL = process.env.SIGNAL_URL ?? "ws://localhost:8789";
const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class Client {
  constructor(label) {
    this.label = label;
    this.inbox = [];
    this.waiters = [];
  }
  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(URL, { origin: "http://localhost:3000" });
      this.ws.on("open", () => this.ws.send(JSON.stringify({ t: "hello" })));
      this.ws.on("message", (raw) => {
        const m = JSON.parse(raw.toString());
        if (m.t === "ping") return this.ws.send(JSON.stringify({ t: "pong" }));
        this.inbox.push(m);
        if (m.t === "ready") resolve(this);
        for (const w of [...this.waiters]) {
          if (w.type === m.t) {
            this.waiters.splice(this.waiters.indexOf(w), 1);
            w.resolve(m);
          }
        }
      });
      this.ws.on("error", reject);
      setTimeout(() => reject(new Error(`${this.label} timeout`)), 20000);
    });
  }
  wait(type, ms = 15000) {
    const found = this.inbox.find((m) => m.t === type);
    if (found) return Promise.resolve(found);
    return new Promise((resolve, reject) => {
      const w = { type, resolve };
      this.waiters.push(w);
      setTimeout(() => {
        if (this.waiters.includes(w)) {
          this.waiters.splice(this.waiters.indexOf(w), 1);
          reject(new Error(`${this.label}: no "${type}"`));
        }
      }, ms);
    });
  }
  last(type) {
    return [...this.inbox].reverse().find((m) => m.t === type);
  }
  send(m) { this.ws.send(JSON.stringify(m)); }
  clear() { this.inbox = []; }
  close() { this.ws.close(); }
}

const prefs = {
  genders: ["female", "male", "nonbinary", "undisclosed"],
  targetLanguages: [], preferInternational: false,
};
const queue = (c, speaks, learning) => c.send({
  t: "queue",
  profile: { speaks, learning, level: "intermediate", gender: "undisclosed", displayName: c.label },
  prefs,
});

async function pair() {
  const a = await new Client("A").connect();
  const b = await new Client("B").connect();
  queue(a, ["es"], ["en"]);
  queue(b, ["en"], ["es"]);
  const [ma] = await Promise.all([a.wait("matched"), b.wait("matched")]);
  return { a, b, ma };
}

async function main() {
  /* --- 1. a match arrives with a deadline ------------------------- */
  {
    const { a, b, ma } = await pair();
    const left = ma.endsAt - Date.now();
    check("the match carries a countdown", left > 0 && left <= 7000, `${Math.round(left / 1000)}s`);

    /* --- 2. one-sided extend does NOT extend ---------------------- */
    a.clear(); b.clear();
    a.send({ t: "extend" });
    await sleep(800);
    const aTimer = a.last("timer");
    const bTimer = b.last("timer");
    check("asking alone does not extend", aTimer?.endsAt === ma.endsAt && aTimer?.round === 0);
    check("the peer is told you asked", bTimer?.peerWants === true && bTimer?.youWant === false);

    /* --- 3. mutual extend moves the deadline ---------------------- */
    b.send({ t: "extend" });
    await sleep(900);
    const after = a.last("timer");
    check(
      "both asking extends the clock",
      after.endsAt > ma.endsAt && after.round === 1,
      `ronda ${after.round}`,
    );
    check("the request resets after agreeing", after.youWant === false && after.peerWants === false);

    /* --- 4. reactions reach the other side ------------------------ */
    b.clear();
    a.send({ t: "react", reaction: "laugh" });
    const got = await b.wait("react", 5000).catch(() => null);
    check("reactions are relayed", got?.reaction === "laugh");

    /* --- 5. a bad reaction is rejected ---------------------------- */
    a.clear();
    a.send({ t: "react", reaction: "definitely-not-allowed" });
    const err = await a.wait("error", 4000).catch(() => null);
    check("unknown reactions are refused", err?.code === "bad_message");

    a.close(); b.close();
  }

  await sleep(500);

  /* --- 6. nobody asks -> the room expires and both requeue -------- */
  {
    const { a, b } = await pair();
    a.clear(); b.clear();
    const gone = await a.wait("peer-left", 12000).catch(() => null);
    check("an unextended conversation times out", gone?.reason === "timeout");
    const requeued = await a.wait("queued", 5000).catch(() => null);
    check("both are put straight back in the queue", Boolean(requeued));
    a.close(); b.close();
  }

  await sleep(200);
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => { console.error("\nFATAL:", e.message); process.exit(1); });
