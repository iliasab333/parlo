import type { Language } from "@parlo/protocol";

/**
 * Country pages exist only where the variant is genuinely different —
 * accent, vocabulary, register. "Practicar inglés con irlandeses" is a
 * real query with a real answer; "practicar tailandés con tailandeses"
 * is the language page with extra words.
 *
 * Thin programmatic pages are how a site gets demoted as a doorway
 * farm, so the test for adding one is whether it says something the
 * language page cannot.
 */
export interface CountryVariant {
  language: Language;
  /** Slug appended to the language page: /practicar/ingles/irlanda */
  slug: string;
  /** ISO 3166-1 alpha-2, for the matcher's region preference. */
  region: string;
  /** Country name, Spanish. */
  pais: string;
  /** How natives are referred to, Spanish. */
  gentilicio: string;
  /** What actually distinguishes this variant. Spanish, bespoke. */
  acento: string;
  /** Overlap with Spanish/Latin-American waking hours. Spanish. */
  horario: string;
}

export const COUNTRY_VARIANTS: CountryVariant[] = [
  /* ---------------------------- English ---------------------------- */
  {
    language: "en", slug: "reino-unido", region: "GB",
    pais: "Reino Unido", gentilicio: "británicos",
    acento: "El inglés que oyes en clase casi nunca es el que se habla en Manchester o Glasgow. Las vocales cambian, las consonantes se comen y la velocidad sube. Es el acento que más cuesta a quien aprendió con material estadounidense.",
    horario: "Una hora menos que la España peninsular: las tardes coinciden casi enteras.",
  },
  {
    language: "en", slug: "estados-unidos", region: "US",
    pais: "Estados Unidos", gentilicio: "estadounidenses",
    acento: "El acento que ya reconoces por el cine, con la erre retrofleja y las tes convertidas en algo parecido a una erre suave. Lo difícil no es entenderlo, es producirlo sin sonar a locutor.",
    horario: "Entre 6 y 9 horas menos que España. Tu tarde es su mañana.",
  },
  {
    language: "en", slug: "irlanda", region: "IE",
    pais: "Irlanda", gentilicio: "irlandeses",
    acento: "Entonación muy marcada y un ritmo que sube al final de las frases. Cuesta las primeras conversaciones y luego se vuelve de los acentos más claros.",
    horario: "Una hora menos que España. Prácticamente el mismo día.",
  },
  {
    language: "en", slug: "australia", region: "AU",
    pais: "Australia", gentilicio: "australianos",
    acento: "Vocales desplazadas y una tendencia fuerte a acortar palabras. El vocabulario coloquial es un mundo aparte del británico o el estadounidense.",
    horario: "Entre 8 y 10 horas más que España: su noche es tu mañana.",
  },

  /* ---------------------------- Español ---------------------------- */
  {
    language: "es", slug: "mexico", region: "MX",
    pais: "México", gentilicio: "mexicanos",
    acento: "Entonación más cantada que la peninsular, seseo y un vocabulario propio enorme. Para un extranjero suele ser el español más fácil de entender.",
    horario: "Entre 7 y 8 horas menos que España.",
  },
  {
    language: "es", slug: "argentina", region: "AR",
    pais: "Argentina", gentilicio: "argentinos",
    acento: "Voseo, la ye pronunciada como «sh» y una melodía de clara influencia italiana. Reconocible al instante y muy distinto del resto.",
    horario: "Entre 4 y 5 horas menos que España: sus mañanas con tus tardes.",
  },
  {
    language: "es", slug: "colombia", region: "CO",
    pais: "Colombia", gentilicio: "colombianos",
    acento: "El español bogotano tiene fama de ser el más neutro del continente: articulación clara y velocidad moderada. En la costa caribeña cambia por completo.",
    horario: "Entre 6 y 7 horas menos que España.",
  },
  {
    language: "es", slug: "espana", region: "ES",
    pais: "España", gentilicio: "españoles",
    acento: "Distinción entre ese y zeta, uso de «vosotros» y una velocidad alta. Lo que más choca a quien aprendió español en América.",
    horario: "Huso europeo central.",
  },

  /* --------------------------- Português --------------------------- */
  {
    language: "pt", slug: "brasil", region: "BR",
    pais: "Brasil", gentilicio: "brasileños",
    acento: "Vocales abiertas, ritmo pausado y las eses finales suaves. Es el portugués que más se oye fuera de Portugal y el más accesible para un hispanohablante.",
    horario: "Entre 4 y 5 horas menos que España.",
  },
  {
    language: "pt", slug: "portugal", region: "PT",
    pais: "Portugal", gentilicio: "portugueses",
    acento: "Vocales átonas que casi desaparecen y un ritmo comprimido. Quien aprendió portugués brasileño suele necesitar varias conversaciones para sintonizar.",
    horario: "Una hora menos que la España peninsular.",
  },

  /* --------------------------- Français ---------------------------- */
  {
    language: "fr", slug: "francia", region: "FR",
    pais: "Francia", gentilicio: "franceses",
    acento: "El francés de referencia, con el enlace entre palabras que convierte una frase en un bloque continuo. Ahí está la dificultad real para el oído español.",
    horario: "Mismo huso que España.",
  },
  {
    language: "fr", slug: "canada", region: "CA",
    pais: "Canadá", gentilicio: "quebequeses",
    acento: "El francés de Quebec tiene vocales y vocabulario propios, y una distancia con el de París mayor de lo que casi nadie espera.",
    horario: "Seis horas menos que España.",
  },
  {
    language: "fr", slug: "belgica", region: "BE",
    pais: "Bélgica", gentilicio: "belgas",
    acento: "Más pausado que el parisino y con algunas diferencias de vocabulario cotidiano, empezando por cómo se dicen los números.",
    horario: "Mismo huso que España.",
  },

  /* ---------------------------- Deutsch ---------------------------- */
  {
    language: "de", slug: "alemania", region: "DE",
    pais: "Alemania", gentilicio: "alemanes",
    acento: "El alemán estándar de los manuales, aunque dentro del país los dialectos varían mucho entre el norte y Baviera.",
    horario: "Mismo huso que España.",
  },
  {
    language: "de", slug: "austria", region: "AT",
    pais: "Austria", gentilicio: "austriacos",
    acento: "Melodía más suave, vocabulario cotidiano distinto y una pronunciación que a quien estudió alemán estándar le suena a otro idioma al principio.",
    horario: "Mismo huso que España.",
  },
  {
    language: "de", slug: "suiza", region: "CH",
    pais: "Suiza", gentilicio: "suizos",
    acento: "El alemán suizo es casi otra lengua hablada, aunque se escriba igual. La mayoría cambia al estándar con extranjeros, pero el acento se queda.",
    horario: "Mismo huso que España.",
  },

  /* ---------------------------- العربية ---------------------------- */
  {
    language: "ar", slug: "marruecos", region: "MA",
    pais: "Marruecos", gentilicio: "marroquíes",
    acento: "El dariya marroquí se aleja mucho del árabe estándar: vocales reducidas y préstamos del francés y del amazigh. Es el árabe más cercano a España.",
    horario: "Misma hora o una menos que España.",
  },
  {
    language: "ar", slug: "egipto", region: "EG",
    pais: "Egipto", gentilicio: "egipcios",
    acento: "El dialecto más entendido del mundo árabe por el peso de su cine y su televisión. Si solo vas a aprender uno, suele ser este.",
    horario: "Una hora más que España.",
  },
  {
    language: "ar", slug: "libano", region: "LB",
    pais: "Líbano", gentilicio: "libaneses",
    acento: "Dialecto levantino, con mezcla habitual de francés e inglés en la conversación cotidiana.",
    horario: "Una hora más que España.",
  },

  /* ------------------------------ 中文 ------------------------------ */
  {
    language: "zh", slug: "china", region: "CN",
    pais: "China", gentilicio: "chinos",
    acento: "Mandarín estándar con los cuatro tonos. El acento del norte marca más la erre final que el del sur.",
    horario: "Entre 6 y 7 horas más que España.",
  },
  {
    language: "zh", slug: "taiwan", region: "TW",
    pais: "Taiwán", gentilicio: "taiwaneses",
    acento: "Mandarín con entonación más suave, sin la erre final del norte, y escritura tradicional en lugar de simplificada.",
    horario: "Entre 6 y 7 horas más que España.",
  },
];

export const variantsFor = (language: Language) =>
  COUNTRY_VARIANTS.filter((v) => v.language === language);

export const findVariant = (language: Language, slug: string) =>
  COUNTRY_VARIANTS.find((v) => v.language === language && v.slug === slug);
