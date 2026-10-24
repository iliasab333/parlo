// A synthetic partner for manual UI testing: queues up, answers, and
// keeps the room alive so you can exercise the real client against it.
import { WebSocket } from "ws";

const ws = new WebSocket(process.env.SIGNAL_URL ?? "ws://localhost:8787", {
  origin: "http://localhost:3000",
});

ws.on("open", () => ws.send(JSON.stringify({ t: "hello" })));

ws.on("message", (raw) => {
  const msg = JSON.parse(raw.toString());

  if (msg.t === "ping") return ws.send(JSON.stringify({ t: "pong" }));

  if (msg.t === "ready") {
    console.log("ready, queueing as Ben (en -> es)");
    ws.send(JSON.stringify({
      t: "queue",
      profile: {
        speaks: ["en"], learning: ["es"], level: "intermediate",
        gender: "male", displayName: "Ben",
      },
      prefs: {
        genders: ["female", "male", "nonbinary", "undisclosed"],
        targetLanguages: ["es"], preferInternational: false,
      },
    }));
  }

  if (msg.t === "matched") {
    console.log("matched with", msg.peer.displayName ?? "anon", msg.peer);
    setTimeout(() => {
      ws.send(JSON.stringify({ t: "typing", on: true }));
      setTimeout(() => ws.send(JSON.stringify({
        t: "chat", text: "Hey! I'm Ben, from Manchester. ¿Practicamos un rato?",
      })), 900);
    }, 500);
  }

  if (msg.t === "chat") {
    console.log("them:", msg.text);
    setTimeout(() => ws.send(JSON.stringify({
      t: "chat", text: "Nice — my Spanish is rusty but let's go.",
    })), 800);
  }

  if (msg.t === "peer-left") console.log("peer left:", msg.reason);
});

process.on("SIGINT", () => { ws.close(); process.exit(0); });
