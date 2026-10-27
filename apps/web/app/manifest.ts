import type { MetadataRoute } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { site } from "@/lib/site";

/**
 * The manifest is a single route, so it cannot vary by locale the way
 * the pages do — it gets the default locale's copy, same as site.ts.
 * It only shows up in the install prompt and under the home-screen
 * icon, both of which the visitor sees after the pages have already
 * told them what this is.
 */
export default function manifest(): MetadataRoute.Manifest {
  const t = getDictionary(DEFAULT_LOCALE);

  return {
    name: `${site.name} — ${t.common.tagline}`,
    // Android truncates around twelve characters under the icon.
    short_name: "Practice",
    description: t.common.description,
    lang: DEFAULT_LOCALE,
    // The proxy reads Accept-Language and redirects, so launching at
    // the root opens the installer's own language rather than pinning
    // whoever installed it to Spanish.
    start_url: "/",
    display: "standalone",
    background_color: "#0b0f14",
    theme_color: "#0b0f14",
    categories: ["education", "social"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android crops to a circle inscribed in the centre 80%; this
      // one is full-bleed with the mark pulled inside that safe zone.
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
