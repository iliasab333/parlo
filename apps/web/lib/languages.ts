import { LANGUAGES, type Language } from "@parlo/protocol";

/**
 * Per-language landing pages. This is the search surface that matters
 * for this product: nobody searches "random video chat", they search
 * "practicar inglés con nativos gratis". One page per language, each
 * answering that query in its own words rather than templated mush.
 */
export interface LanguagePage {
  code: Language;
  /** URL slug, in Spanish — this is a Spanish-language front end. */
  slug: string;
  /** "practicar {el}" — article varies, and getting it wrong reads badly. */
  nombre: string;
  /** Demonym used for native speakers, e.g. "nativos británicos". */
  hablantes: string;
  /** One concrete reason this language is worth practising by voice. */
  gancho: string;
}

export const LANGUAGE_PAGES: LanguagePage[] = [
  { code: "en", slug: "ingles", nombre: "inglés", hablantes: "nativos de Reino Unido, Irlanda, EE. UU. o Australia",
    gancho: "El inglés escrito se aprende solo; el hablado necesita a alguien al otro lado que no te corrija con paciencia infinita." },
  { code: "fr", slug: "frances", nombre: "francés", hablantes: "nativos de Francia, Bélgica, Quebec o Senegal",
    gancho: "La distancia entre el francés que lees y el que se habla a velocidad normal es enorme. Solo se cierra escuchando." },
  { code: "de", slug: "aleman", nombre: "alemán", hablantes: "nativos de Alemania, Austria o Suiza",
    gancho: "Los casos se memorizan; colocarlos sin pensar mientras hablas es otra cosa, y solo llega con conversación." },
  { code: "it", slug: "italiano", nombre: "italiano", hablantes: "nativos de Italia",
    gancho: "Para un hispanohablante el italiano engaña: se entiende pronto y se habla mal durante años. Hace falta que te lo señalen." },
  { code: "pt", slug: "portugues", nombre: "portugués", hablantes: "nativos de Portugal o Brasil",
    gancho: "El portunhol es cómodo y es un techo. Romperlo exige hablar con quien no te lo acepte." },
  { code: "ja", slug: "japones", nombre: "japonés", hablantes: "nativos de Japón",
    gancho: "El registro cambia según con quién hables. Eso no está en los libros: se aprende en conversaciones reales." },
  { code: "ko", slug: "coreano", nombre: "coreano", hablantes: "nativos de Corea del Sur",
    gancho: "Los niveles de formalidad se interiorizan hablando, no estudiando tablas." },
  { code: "zh", slug: "chino", nombre: "chino", hablantes: "nativos de China o Taiwán",
    gancho: "Los tonos no se corrigen leyendo. Necesitas a alguien que te diga, al momento, que has dicho otra palabra." },
  { code: "ar", slug: "arabe", nombre: "árabe", hablantes: "nativos de Marruecos, Egipto, Líbano o el Golfo",
    gancho: "Entre el árabe estándar y el dialecto de cada país hay un salto que solo se cruza conversando." },
  { code: "ru", slug: "ruso", nombre: "ruso", hablantes: "nativos de Rusia, Bielorrusia o Kazajistán",
    gancho: "La declinación deja de dar miedo cuando la usas en voz alta y te equivocas delante de alguien amable." },
  { code: "nl", slug: "neerlandes", nombre: "neerlandés", hablantes: "nativos de Países Bajos o Bélgica",
    gancho: "Casi todos los neerlandeses cambiarán al inglés contigo. Aquí no: vienen a practicar español." },
  { code: "pl", slug: "polaco", nombre: "polaco", hablantes: "nativos de Polonia",
    gancho: "Pocas oportunidades de practicarlo fuera de Polonia. Esta es una de ellas." },
  { code: "tr", slug: "turco", nombre: "turco", hablantes: "nativos de Turquía",
    gancho: "La aglutinación se vuelve natural hablando, mucho antes que estudiando sufijos uno a uno." },
  { code: "sv", slug: "sueco", nombre: "sueco", hablantes: "nativos de Suecia",
    gancho: "El acento melódico distingue palabras. Hay que oírlo de alguien que lo haga sin pensar." },
  { code: "uk", slug: "ucraniano", nombre: "ucraniano", hablantes: "nativos de Ucrania",
    gancho: "Una comunidad grande y dispersa, con ganas de practicar español." },
  { code: "hi", slug: "hindi", nombre: "hindi", hablantes: "nativos de India",
    gancho: "El hindi conversacional mezcla registros e inglés de un modo que ningún curso reproduce." },
  { code: "id", slug: "indonesio", nombre: "indonesio", hablantes: "nativos de Indonesia",
    gancho: "Gramática amable y pronunciación directa: de los idiomas donde antes se nota hablar con alguien." },
  { code: "vi", slug: "vietnamita", nombre: "vietnamita", hablantes: "nativos de Vietnam",
    gancho: "Seis tonos. No hay forma de aprenderlos en silencio." },
  { code: "th", slug: "tailandes", nombre: "tailandés", hablantes: "nativos de Tailandia",
    gancho: "Tonos y vocales largas que el oído español no distingue hasta que las oye mucho." },
  { code: "es", slug: "espanol", nombre: "español", hablantes: "nativos de España y Latinoamérica",
    gancho: "Si ya lo hablas, eres justo lo que media plataforma está buscando — y practicas lo tuyo a cambio." },
];

export const pageBySlug = (slug: string) => LANGUAGE_PAGES.find((p) => p.slug === slug);

/** Guards against a language existing in the protocol but not here. */
export const missingPages = LANGUAGES.filter(
  (code) => !LANGUAGE_PAGES.some((p) => p.code === code),
);
