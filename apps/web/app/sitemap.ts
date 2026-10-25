import type { MetadataRoute } from "next";
import { LOCALES, LOCALE_HREFLANG, DEFAULT_LOCALE } from "@/lib/i18n";
import { COUNTRY_VARIANTS } from "@/lib/countries";
import { LANGUAGE_PAGES } from "@/lib/languages";
import { PURPOSES } from "@/lib/purposes";
import { absolute } from "@/lib/site";

/**
 * Every URL lists its translations under `alternates.languages`, which
 * is how Google learns the six locales are one page in six languages
 * rather than six near-duplicates competing with each other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Stable date: a sitemap that claims "modified today" on every build
  // trains crawlers to ignore the field.
  const lastModified = new Date("2026-10-25");

  const alternates = (path: string) => ({
    languages: {
      ...Object.fromEntries(
        LOCALES.map((l) => [LOCALE_HREFLANG[l], absolute(`/${l}${path}`)]),
      ),
      "x-default": absolute(`/${DEFAULT_LOCALE}${path}`),
    },
  });

  const countryPaths = COUNTRY_VARIANTS.flatMap((v) => {
    const page = LANGUAGE_PAGES.find((p) => p.code === v.language);
    return page ? [`/practicar/${page.slug}/${v.slug}`] : [];
  });

  const paths = [
    "",
    ...LANGUAGE_PAGES.map((p) => `/practicar/${p.slug}`),
    ...countryPaths,
    ...PURPOSES.map((p) => `/para/${p.slug}`),
  ];

  return LOCALES.flatMap((locale) =>
    paths.map((path) => ({
      url: absolute(`/${locale}${path}`),
      lastModified,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.8,
      alternates: alternates(path),
    })),
  );
}
