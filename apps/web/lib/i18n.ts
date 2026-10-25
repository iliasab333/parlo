/**
 * UI locales.
 *
 * Deliberately six, not the twenty languages you can practise here.
 * A language-exchange product whose own copy reads like a bad
 * translation undercuts its entire premise, so this list stops where
 * the quality can be vouched for. Adding one means writing a
 * dictionary a native speaker has read — not running the Spanish
 * through a machine.
 */
export const LOCALES = ["es", "en", "pt", "fr", "de", "it"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export const LOCALE_NAMES: Record<Locale, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
};

/** For <html lang> and hreflang: a bare code is the honest claim here. */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  es: "es",
  en: "en",
  pt: "pt",
  fr: "fr",
  de: "de",
  it: "it",
};

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

/** Strip the locale prefix from a pathname, e.g. /fr/chat -> /chat */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if (first && isLocale(first)) return `/${rest.join("/")}`;
  return pathname;
}
