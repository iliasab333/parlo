/**
 * One place for everything that has to agree across metadata, the
 * sitemap, robots and JSON-LD. Getting the canonical origin wrong in
 * one of them is the classic way to split your own ranking signals.
 */
export const site = {
  name: "Parlo",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://parlo-seven.vercel.app").replace(/\/$/, ""),
  locale: "es_ES",
  tagline: "Practica idiomas hablando con nativos, ahora",
  description:
    "Videochat aleatorio para intercambio de idiomas. Te emparejamos con alguien que habla lo que estudias y estudia lo que hablas. Gratis y solo para mayores de 18 años.",
} as const;

export const absolute = (path = "/") => `${site.url}${path}`;
