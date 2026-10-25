import type { Locale } from "./i18n";

/**
 * "from <country>", written the way each language actually writes it.
 *
 * Intl.DisplayNames gives the bare country name, which is not enough:
 * Romance languages and German contract the preposition with the
 * article, and the rule is per-country, not per-language. "de Reino
 * Unido" is wrong in Portuguese ("do Reino Unido"), "de la France" is
 * wrong in French ("de France"), "aus dem Libanon" takes an article
 * where "aus Marokko" does not.
 *
 * Getting this wrong is exactly the tell that a product was machine
 * translated — which is a bad look for a language-learning site, so
 * these are written out rather than generated.
 */
type Phrases = Record<Locale, string>;

export const PLACE_FROM: Record<string, Phrases> = {
  GB: { es: "del Reino Unido", en: "from the United Kingdom", pt: "do Reino Unido", fr: "du Royaume-Uni", de: "aus dem Vereinigten Königreich", it: "dal Regno Unito" },
  US: { es: "de Estados Unidos", en: "from the United States", pt: "dos Estados Unidos", fr: "des États-Unis", de: "aus den Vereinigten Staaten", it: "dagli Stati Uniti" },
  IE: { es: "de Irlanda", en: "from Ireland", pt: "da Irlanda", fr: "d'Irlande", de: "aus Irland", it: "dall'Irlanda" },
  AU: { es: "de Australia", en: "from Australia", pt: "da Austrália", fr: "d'Australie", de: "aus Australien", it: "dall'Australia" },

  MX: { es: "de México", en: "from Mexico", pt: "do México", fr: "du Mexique", de: "aus Mexiko", it: "dal Messico" },
  AR: { es: "de Argentina", en: "from Argentina", pt: "da Argentina", fr: "d'Argentine", de: "aus Argentinien", it: "dall'Argentina" },
  CO: { es: "de Colombia", en: "from Colombia", pt: "da Colômbia", fr: "de Colombie", de: "aus Kolumbien", it: "dalla Colombia" },
  ES: { es: "de España", en: "from Spain", pt: "de Espanha", fr: "d'Espagne", de: "aus Spanien", it: "dalla Spagna" },

  BR: { es: "de Brasil", en: "from Brazil", pt: "do Brasil", fr: "du Brésil", de: "aus Brasilien", it: "dal Brasile" },
  PT: { es: "de Portugal", en: "from Portugal", pt: "de Portugal", fr: "du Portugal", de: "aus Portugal", it: "dal Portogallo" },

  FR: { es: "de Francia", en: "from France", pt: "de França", fr: "de France", de: "aus Frankreich", it: "dalla Francia" },
  CA: { es: "de Canadá", en: "from Canada", pt: "do Canadá", fr: "du Canada", de: "aus Kanada", it: "dal Canada" },
  BE: { es: "de Bélgica", en: "from Belgium", pt: "da Bélgica", fr: "de Belgique", de: "aus Belgien", it: "dal Belgio" },

  DE: { es: "de Alemania", en: "from Germany", pt: "da Alemanha", fr: "d'Allemagne", de: "aus Deutschland", it: "dalla Germania" },
  AT: { es: "de Austria", en: "from Austria", pt: "da Áustria", fr: "d'Autriche", de: "aus Österreich", it: "dall'Austria" },
  CH: { es: "de Suiza", en: "from Switzerland", pt: "da Suíça", fr: "de Suisse", de: "aus der Schweiz", it: "dalla Svizzera" },

  MA: { es: "de Marruecos", en: "from Morocco", pt: "de Marrocos", fr: "du Maroc", de: "aus Marokko", it: "dal Marocco" },
  EG: { es: "de Egipto", en: "from Egypt", pt: "do Egito", fr: "d'Égypte", de: "aus Ägypten", it: "dall'Egitto" },
  LB: { es: "de Líbano", en: "from Lebanon", pt: "do Líbano", fr: "du Liban", de: "aus dem Libanon", it: "dal Libano" },

  CN: { es: "de China", en: "from China", pt: "da China", fr: "de Chine", de: "aus China", it: "dalla Cina" },
  TW: { es: "de Taiwán", en: "from Taiwan", pt: "de Taiwan", fr: "de Taïwan", de: "aus Taiwan", it: "da Taiwan" },
};

/** Falls back to the bare name if a region is ever added without a phrase. */
export function placeFrom(locale: Locale, region: string, fallback: string): string {
  return PLACE_FROM[region]?.[locale] ?? fallback;
}
