import type { MetadataRoute } from "next";
import { LANGUAGE_PAGES } from "@/lib/languages";
import { absolute } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Stable date: a sitemap that claims "modified today" on every build
  // trains crawlers to ignore the field.
  const lastModified = new Date("2026-10-25");

  return [
    { url: absolute("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    // /chat is the app itself: useful to users, useless as a landing
    // page, and it sits behind an age gate. Kept out of the index.
    ...LANGUAGE_PAGES.map((page) => ({
      url: absolute(`/practicar/${page.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
