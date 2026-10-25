/**
 * Check that a domain is fully wired, not just resolving.
 *
 *   node scripts/verify-domain.mjs practicewithnatives.com
 *
 * The failure this exists to catch: every page returns 200 while the
 * chat silently 403s, because ALLOWED_ORIGINS on the signalling server
 * is an allowlist and nobody remembered to add the new domain. The
 * site looks perfect and the product does not work.
 */
import { WebSocket } from "ws";

const domain = process.argv[2];
if (!domain) {
  console.error("uso: node scripts/verify-domain.mjs <dominio>");
  process.exit(1);
}

const BASE = `https://${domain}`;
const SIGNAL = process.env.SIGNAL_URL ?? "wss://parlo-signal.onrender.com";
const results = [];
const check = (name, pass, detail = "") => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

const get = async (path, redirect = "follow") => {
  try {
    return await fetch(BASE + path, { redirect, signal: AbortSignal.timeout(30000) });
  } catch (e) {
    return { status: 0, error: e.message };
  }
};

const LOCALES = ["es", "en", "pt", "fr", "de", "it"];

async function main() {
  /* --- pages ---------------------------------------------------- */
  for (const l of LOCALES) {
    const r = await get(`/${l}`);
    check(`/${l} responde`, r.status === 200, `HTTP ${r.status}`);
  }

  const chat = await get("/es/chat");
  check("/es/chat responde", chat.status === 200, `HTTP ${chat.status}`);

  /* --- locale detection ------------------------------------------ */
  const fr = await get("/", "manual");
  const loc = fr.headers?.get?.("location") ?? "";
  check("la raíz redirige por idioma", /\/(es|en|pt|fr|de|it)$/.test(loc), loc || "sin redirección");

  /* --- canonical points HERE, not at an older domain -------------- */
  const html = await (await get("/es")).text?.() ?? "";
  const canonical = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1] ?? "";
  check(
    "el canonical apunta a este dominio",
    canonical.startsWith(BASE),
    canonical || "ausente",
  );

  /* --- sitemap --------------------------------------------------- */
  const sm = await get("/sitemap.xml");
  const smText = sm.status === 200 ? await sm.text() : "";
  const locs = (smText.match(/<loc>/g) || []).length;
  check("el sitemap se sirve", sm.status === 200 && locs > 100, `${locs} URLs`);
  check(
    "las URLs del sitemap usan este dominio",
    smText.includes(`<loc>${BASE}`),
    smText.includes(`<loc>${BASE}`) ? "" : "apuntan a otro dominio",
  );

  /* --- the one that is easy to miss ------------------------------- */
  const accepted = await new Promise((resolve) => {
    const ws = new WebSocket(SIGNAL, { origin: BASE });
    const done = (v) => { resolve(v); try { ws.close(); } catch {} };
    ws.on("open", () => done(true));
    ws.on("error", () => done(false));
    setTimeout(() => done(false), 25000);
  });
  check(
    "el servidor de chat acepta este origen",
    accepted,
    accepted ? "" : "403 — falta en ALLOWED_ORIGINS en Render",
  );

  const failed = results.filter((r) => !r).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });
