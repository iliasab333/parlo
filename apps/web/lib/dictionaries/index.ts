import type { Locale } from "../i18n";
import { es, type Dictionary } from "./es";
import { en } from "./en";
import { pt } from "./pt";
import { fr } from "./fr";
import { de } from "./de";
import { it } from "./it";

const DICTIONARIES: Record<Locale, Dictionary> = { es, en, pt, fr, de, it };

export const getDictionary = (locale: Locale): Dictionary => DICTIONARIES[locale];

export type { Dictionary };

/** Fill `{lang}`-style slots without pulling in an i18n runtime. */
export const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
