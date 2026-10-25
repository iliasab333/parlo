/**
 * Purpose pages answer "why am I practising", which is a different
 * query from "which language". Five of them, each a hub that links out
 * to every language — rather than one page per language × purpose,
 * which would be 100 near-identical pages and the fastest way to be
 * read as a doorway farm.
 *
 * The tips are the reason the page exists. A purpose page that only
 * repeats the home page in different words should be deleted.
 */
/** The dictionaries key their labels by these, so it has to be a union. */
export type PurposeSlug =
  | "conversacion"
  | "entrevista-de-trabajo"
  | "viajes"
  | "examen-oral"
  | "pronunciacion";

export interface Purpose {
  slug: PurposeSlug;
  /** Spanish; other locales fall back to the generic framing. */
  nombre: string;
  titulo: string;
  /** The problem this purpose actually has. */
  problema: string;
  /** Concrete things to do in a session. Not platitudes. */
  consejos: string[];
}

export const PURPOSES: Purpose[] = [
  {
    slug: "conversacion",
    nombre: "ganar soltura",
    titulo: "Practicar conversación para ganar soltura",
    problema:
      "Entiendes casi todo y aun así te bloqueas al hablar. No es falta de vocabulario: es que nunca has tenido que producir el idioma en tiempo real, con alguien esperando al otro lado. Esa presión no se simula estudiando.",
    consejos: [
      "No prepares temas. El objetivo es responder a lo que surja, que es lo que pasa en la vida real.",
      "Cuando no te salga una palabra, descríbela en lugar de cambiar al español. Rodear el vacío es la habilidad que de verdad te hace fluido.",
      "Pide que te interrumpan solo cuando no te entiendan, no cada vez que cometas un error. Corregirlo todo mata la conversación.",
      "Habla más de lo que escuchas. Es incómodo y es el único modo de avanzar.",
    ],
  },
  {
    slug: "entrevista-de-trabajo",
    nombre: "una entrevista de trabajo",
    titulo: "Practicar un idioma para una entrevista de trabajo",
    problema:
      "Una entrevista no es una conversación: es un registro concreto, con preguntas previsibles y una exigencia de precisión que la charla informal no tiene. Puedes hablar bien y aun así sonar inseguro en ese contexto.",
    consejos: [
      "Cuenta tu trayectoria en voz alta hasta que dure dos minutos sin titubeos. Es la pregunta que siempre cae.",
      "Practica hablar de fracasos. Es la pregunta que peor se improvisa en otro idioma.",
      "Pide a tu compañero que te haga preguntas incómodas de seguimiento. Lo difícil nunca es la primera respuesta.",
      "Graba mentalmente qué conectores usas. En registro profesional, repetir «and then» delata el nivel más que el acento.",
    ],
  },
  {
    slug: "viajes",
    nombre: "un viaje",
    titulo: "Practicar un idioma antes de viajar",
    problema:
      "El idioma de los viajes no es el de los libros. Son interacciones cortas, con ruido, con gente que tiene prisa y no va a repetir despacio. Saber conjugar no ayuda si no entiendes la respuesta.",
    consejos: [
      "Pide a tu compañero que hable a velocidad normal desde el principio. Acostumbrarte al ritmo real importa más que el vocabulario.",
      "Practica entender respuestas, no hacer preguntas. Preguntar la hora es fácil; entenderla no.",
      "Pregunta por costumbres concretas de su ciudad. Es información que ninguna guía te da igual de bien.",
      "Aprende a decir «más despacio, por favor» con naturalidad. Lo vas a usar mucho.",
    ],
  },
  {
    slug: "examen-oral",
    nombre: "un examen oral",
    titulo: "Preparar la prueba oral de un examen de idiomas",
    problema:
      "La prueba oral de un B2, un C1, un IELTS o un TOEFL evalúa cosas específicas: coherencia, riqueza léxica, capacidad de argumentar. Se puede suspender hablando con fluidez si no estructuras.",
    consejos: [
      "Argumenta siempre en tres partes: postura, razón, ejemplo. Los examinadores puntúan la estructura.",
      "Practica monólogos de dos minutos sobre temas que no te interesan. En el examen no eliges.",
      "Fuérzate a usar condicionales y subjuntivo aunque la conversación no lo pida. Ahí están los puntos.",
      "Pide a tu compañero que te lleve la contraria. Defender una postura es la mitad de la nota.",
    ],
  },
  {
    slug: "pronunciacion",
    nombre: "mejorar la pronunciación",
    titulo: "Practicar pronunciación y acento con nativos",
    problema:
      "La pronunciación es lo único que no puedes corregir solo: no oyes tu propio error. Necesitas a alguien que note, en el momento, que has dicho otra cosa.",
    consejos: [
      "Pide corrección fonética explícita. La mayoría de la gente no corrige por educación si no se lo pides.",
      "Céntrate en los sonidos que tu idioma no tiene. Son los que te delatan, no la entonación.",
      "Repite la palabra corregida tres veces en voz alta antes de seguir. Si no, no se fija.",
      "Haz sesiones cortas y frecuentes. La pronunciación mejora por repetición, no por horas seguidas.",
    ],
  },
];

export const findPurpose = (slug: string) => PURPOSES.find((p) => p.slug === slug);
