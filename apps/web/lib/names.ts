import type { Language } from "@parlo/protocol";
import type { Locale } from "./i18n";

/**
 * Language and country names, localised by the platform.
 *
 * These used to be hardcoded Spanish ("inglés", "británicos") and were
 * rendered on every locale, so the English pages read "Practice inglés
 * with británicos". Intl.DisplayNames ships with the runtime and knows
 * all 20 languages and 21 regions in all six locales, which beats 240
 * hand-written strings that would drift the moment a language is added.
 */
const languageCache = new Map<string, Intl.DisplayNames>();
const regionCache = new Map<string, Intl.DisplayNames>();

function displayNames(cache: Map<string, Intl.DisplayNames>, locale: Locale, type: "language" | "region") {
  let dn = cache.get(locale);
  if (!dn) {
    dn = new Intl.DisplayNames([locale], { type });
    cache.set(locale, dn);
  }
  return dn;
}

/** Lowercase in the languages that write language names lowercase. */
const LOWERCASES_LANGUAGES: Record<Locale, boolean> = {
  es: true,
  en: false,
  pt: true,
  fr: true,
  de: false, // German capitalises every noun.
  it: true,
};

export function languageName(locale: Locale, code: Language): string {
  const raw = displayNames(languageCache, locale, "language").of(code) ?? code;
  // Intl capitalises the first letter; Spanish, Portuguese, French and
  // Italian write language names lowercase mid-sentence, which is where
  // these appear.
  return LOWERCASES_LANGUAGES[locale] ? raw.charAt(0).toLowerCase() + raw.slice(1) : raw;
}

export function countryName(locale: Locale, region: string): string {
  return displayNames(regionCache, locale, "region").of(region) ?? region;
}

/**
 * Language names with the definite article, for the verbs that demand
 * one. French and Italian split on this: "pratiquer l'anglais" but
 * "parler anglais"; "praticare l'inglese" but "parlare inglese". The
 * article is gendered and elides before a vowel, so it cannot be
 * derived from the name — hence the table.
 *
 * Spanish, English, Portuguese and German take the bare name in every
 * template here, so they are absent and fall through.
 */
const WITH_ARTICLE: Partial<Record<Locale, Partial<Record<Language, string>>>> = {
  fr: {
    en: "l'anglais", es: "l'espagnol", pt: "le portugais", fr: "le français",
    de: "l'allemand", it: "l'italien", nl: "le néerlandais", pl: "le polonais",
    tr: "le turc", ru: "le russe", ar: "l'arabe", hi: "l'hindi",
    id: "l'indonésien", ja: "le japonais", ko: "le coréen", zh: "le chinois",
    vi: "le vietnamien", th: "le thaï", sv: "le suédois", uk: "l'ukrainien",
  },
  it: {
    en: "l'inglese", es: "lo spagnolo", pt: "il portoghese", fr: "il francese",
    de: "il tedesco", it: "l'italiano", nl: "l'olandese", pl: "il polacco",
    tr: "il turco", ru: "il russo", ar: "l'arabo", hi: "l'hindi",
    id: "l'indonesiano", ja: "il giapponese", ko: "il coreano", zh: "il cinese",
    vi: "il vietnamita", th: "il thailandese", sv: "lo svedese", uk: "l'ucraino",
  },
};

/** The `{langA}` slot. Falls back to the bare name where no article is due. */
export function languageWithArticle(locale: Locale, code: Language): string {
  return WITH_ARTICLE[locale]?.[code] ?? languageName(locale, code);
}
