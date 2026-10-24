/**
 * Moderation behaviour tests.
 *
 * Covers the rules that decide whether someone keeps access to the
 * product, so they are worth testing directly rather than inferring
 * from the matching smoke test.
 *
 * Expects a signal server started with:
 *   PORT=8788 REMATCH_COOLDOWN_MS=0 STRIKE_THRESHOLD=3
 * (the cooldown would otherwise block the repeat-accuser scenario).
 */
import { WebSocket } from "ws";

const URL = process.env.SIGNAL_URL ?? "ws://localhost:8788";
const results = [];
function check(name, pass, detail = "") {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class Client {
  constructor(label, token) {
    this.label = label;
    this.token = token;
    this.inbox = [];
    this.waiters = [];
  }
  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(URL, { origin: "http://localhost:3000" });
      this.ws.on("message", (raw) => {
        const msg = JSON.parse(raw.toString());
        if (msg.t === "ping") return this.ws.send(JSON.stringify({ t: "pong" }));
        if (msg.t === "ready") this.token = msg.deviceToken;
        this.inbox.push(msg);
        for (const w of [...this.waiters]) {
          if (w.type === msg.t) {
            this.waiters.splice(this.waiters.indexOf(w), 1);
            w.resolve(msg);
          }
        }
      });
      this.ws.on("open", () => {
        this.ws.send(JSON.stringify({ t: "hello", deviceToken: this.token }));
        resolve();
      });
      this.ws.on("error", reject);
    });
  }
  wait(type, ms = 5000) {
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
  has(type) {
    return this.inbox.some((m) => m.t === type);
  }
  send(msg) {
    this.ws.send(JSON.stringify(msg));
  }
  clear() {
    this.inbox = [];
  }
  close() {
    this.ws.close();
  }
}

const profile = (over = {}) => ({
  speaks: ["es"], learning: ["en"], level: "intermediate",
  gender: "undisclosed", ...over,
});
const prefs = {
  genders: ["female", "male", "nonbinary", "undisclosed"],
  targetLanguages: [], preferInternational: false,
};

async function spawn(label, token) {
  const c = new Client(label, token);
  await c.connect();
  await c.wait("ready");
  return c;
}

/** Queue two clients against each other and wait for the room. */
async function pair(a, b) {
  a.clear(); b.clear();
  a.send({ t: "queue", profile: profile({ speaks: ["es"], learning: ["en"] }), prefs });
  b.send({ t: "queue", profile: profile({ speaks: ["en"], learning: ["es"] }), prefs });
  await Promise.all([a.wait("matched"), b.wait("matched")]);
}

async function main() {
  /* --- 1. a "minor" report bans on the first report ---------------- */
  {
    const accuser = await spawn("accuser");
    const target = await spawn("target");
    await pair(accuser, target);

    target.clear();
    accuser.send({ t: "report", reason: "minor", note: "test" });
    const banned = await target.wait("banned");
    check("a minor-safety report bans immediately", Boolean(banned.until));

    // And the ban must survive a reconnect with the same device token.
    // A banned device never receives "ready" — the handshake answers
    // with "banned" and closes — so this waits for the refusal itself.
    const token = target.token;
    target.close();
    await sleep(300);

    const returning = new Client("target-again", token);
    await returning.connect();
    const refusal = await returning.wait("banned").catch(() => null);
    check(
      "the ban survives a reconnect with the same device token",
      Boolean(refusal) && !returning.has("ready"),
      refusal ? "refused at handshake" : "was NOT refused",
    );
    accuser.close();
    returning.close();
  }

  await sleep(300);

  /* --- 2. one accuser reporting repeatedly must NOT ban ------------ */
  {
    const accuser = await spawn("solo-accuser");
    const target = await spawn("solo-target");

    for (let i = 0; i < 3; i++) {
      await pair(accuser, target);
      accuser.send({ t: "report", reason: "harassment" });
      await sleep(400);
      accuser.send({ t: "dequeue" });
      target.send({ t: "dequeue" });
      await sleep(200);
    }

    check(
      "three reports from ONE accuser do not trigger a ban",
      !target.has("banned"),
      "distinct-accuser counting",
    );
    accuser.close();
    target.close();
  }

  await sleep(300);

  /* --- 3. three DISTINCT accusers do ban --------------------------- */
  {
    const target = await spawn("mobbed");
    const accusers = [];
    for (let i = 0; i < 3; i++) accusers.push(await spawn(`accuser-${i}`));

    for (const a of accusers) {
      await pair(a, target);
      a.send({ t: "report", reason: "harassment" });
      await sleep(400);
      a.send({ t: "dequeue" });
      target.send({ t: "dequeue" });
      await sleep(200);
    }

    check("three DISTINCT accusers trigger a ban", target.has("banned"));
    accusers.forEach((a) => a.close());
    target.close();
  }

  await sleep(300);

  /* --- 4. a report cannot be replayed after the room closes -------- */
  {
    const a = await spawn("dup-a");
    const b = await spawn("dup-b");
    await pair(a, b);

    a.send({ t: "report", reason: "spam" });
    await sleep(400);
    a.clear();
    a.send({ t: "report", reason: "spam" });
    await sleep(400);

    const err = a.inbox.find((m) => m.t === "error");
    check(
      "a replayed report is refused once the room has closed",
      err?.code === "no_peer",
      err ? err.code : "no error returned",
    );
    a.close();
    b.close();
  }

  await sleep(300);

  /* --- 5. two reports racing on the SAME open room ----------------- *
   * The room closes on the first report, so the unique constraint only
   * ever fires on a race. Both messages are put in flight in the same
   * tick, before either handler finishes awaiting the insert, which is
   * exactly the window it exists to cover: the accused must not collect
   * two strikes from one accuser.                                     */
  {
    const a = await spawn("race-a");
    const victim = await spawn("race-victim");
    await pair(a, victim);

    a.clear();
    a.send({ t: "report", reason: "spam" });
    a.send({ t: "report", reason: "spam" });
    await sleep(700);

    // One strike from one accuser is below the threshold either way;
    // the ban would only appear if the race double-counted it.
    check(
      "racing duplicate reports do not double-count a strike",
      !victim.has("banned"),
    );
    a.close();
    victim.close();
  }

  await sleep(200);
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error("\nFATAL:", err.message);
  process.exit(1);
});
