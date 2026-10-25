/**
 * One place for everything that has to agree across metadata, the
 * sitemap, robots and JSON-LD. Getting the canonical origin wrong in
 * one of them is the classic way to split your own ranking signals.
 */
export const site = {
  name: "Lingora",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://golingora.vercel.app").replace(/\/$/, ""),
  locale: "es_ES",

  /**
   * Shown to suspended accounts as the appeal route. A dead address
   * here is worse than none: the DSA requires an appeal mechanism that
   * actually works, and this one is not wired to a mailbox yet.
   * Set NEXT_PUBLIC_SUPPORT_EMAIL before launch.
   */
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "soporte@example.invalid",
  tagline: "Practica idiomas hablando con nativos, ahora",
  description:
    "Videochat aleatorio para intercambio de idiomas. Te emparejamos con alguien que habla lo que estudias y estudia lo que hablas. Gratis y solo para mayores de 18 años.",
} as const;

export const absolute = (path = "/") => `${site.url}${path}`;
