import Link from "next/link";
import { LANGUAGE_PAGES } from "@/lib/languages";
import { absolute, site } from "@/lib/site";

const steps = [
  {
    title: "Di qué hablas y qué practicas",
    body: "Tu idioma nativo y el que quieres mejorar. El emparejamiento busca reciprocidad real: tú enseñas, tú aprendes.",
  },
  {
    title: "Te emparejamos al azar",
    body: "Con alguien compatible de otro país. Sin perfiles que revisar, sin swipe, sin esperar respuesta.",
  },
  {
    title: "Dos minutos para romper el hielo",
    body: "La conversación se acaba sola salvo que los dos queráis seguir. Nadie tiene que ser quien la corta.",
  },
];

const faq = [
  {
    q: "¿Qué es Parlo?",
    a: "Un videochat de intercambio de idiomas. Te empareja al azar con un hablante nativo del idioma que estudias, que a su vez está aprendiendo el tuyo. Las conversaciones empiezan con dos minutos y se alargan solo si los dos queréis.",
  },
  {
    q: "¿Es gratis?",
    a: "Sí. El emparejamiento y las conversaciones son gratuitas.",
  },
  {
    q: "¿Hace falta registrarse?",
    a: "No necesitas crear una cuenta. Sí tienes que confirmar que eres mayor de 18 años: Parlo empareja desconocidos por vídeo y es una plataforma exclusivamente para adultos.",
  },
  {
    q: "¿Se graban las conversaciones?",
    a: "No. El vídeo y el audio viajan directamente de un navegador a otro mediante WebRTC. El servidor solo ayuda a establecer la conexión; nunca ve ni almacena el contenido.",
  },
  {
    q: "¿Puedo filtrar con quién hablo?",
    a: "Puedes filtrar por idioma y por género, y pedir que se priorice a gente de otro país. El filtro de género se respeta en ambos sentidos y nunca se amplía solo, por larga que sea la espera.",
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: site.name,
        url: absolute("/"),
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        inLanguage: "es",
        description: site.description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        audience: { "@type": "PeopleAudience", suggestedMinAge: 18 },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl bg-accent/15 text-accent">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-4.3-1L3 20l1.3-4a8.2 8.2 0 0 1-1.1-4.5 8.4 8.4 0 0 1 8.9-8.4 8.4 8.4 0 0 1 8.9 8.4Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">{site.name}</span>
        </div>
        <span className="rounded-full border border-ink-700 px-3 py-1 text-xs font-medium text-ink-300">
          Solo +18
        </span>
      </header>

      <section className="flex flex-1 flex-col justify-center py-16">
        <p className="mb-4 text-sm font-medium tracking-wide text-accent uppercase">
          Intercambio de idiomas, en vivo
        </p>
        <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Habla con un nativo ahora mismo.
          <span className="block text-ink-500">No en tres semanas.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300">
          Parlo te empareja al azar con alguien del otro lado del mundo que habla
          lo que tú estudias y estudia lo que tú hablas. Dos minutos para empezar,
          y seguís si los dos queréis.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="/chat"
            className="rounded-xl bg-accent px-6 py-3.5 font-semibold text-ink-950 transition hover:brightness-110"
          >
            Empezar a hablar
          </Link>
          <span className="text-sm text-ink-500">
            Requiere verificación de edad · Gratis
          </span>
        </div>
      </section>

      <section className="grid gap-5 border-t border-ink-800 pt-12 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title}>
            <div className="mb-3 grid size-7 place-items-center rounded-lg bg-ink-800 text-xs font-semibold text-accent">
              {i + 1}
            </div>
            <h2 className="mb-1.5 font-semibold">{step.title}</h2>
            <p className="text-sm leading-relaxed text-ink-500">{step.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 border-t border-ink-800 pt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Elige tu idioma</h2>
        <p className="mt-2 text-sm text-ink-500">
          Veinte idiomas, cada uno con su propia comunidad de gente aprendiendo
          español.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {LANGUAGE_PAGES.map((p) => (
            <Link
              key={p.slug}
              href={`/practicar/${p.slug}`}
              className="rounded-lg border border-ink-700 px-3.5 py-2 text-sm text-ink-300 transition hover:border-accent hover:text-accent"
            >
              Practicar {p.nombre}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-ink-800 pt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Preguntas frecuentes</h2>
        <div className="mt-5 divide-y divide-ink-800 border-y border-ink-800">
          {faq.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none font-medium marker:content-none">
                <span className="transition group-open:text-accent">{item.q}</span>
              </summary>
              <p className="mt-2.5 max-w-2xl leading-relaxed text-ink-500">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-ink-800 pt-6 text-xs text-ink-500">
        <p className="max-w-xl leading-relaxed">
          Parlo es una plataforma para mayores de 18 años. Moderamos activamente,
          no grabamos las conversaciones y reportamos material de abuso infantil
          a las autoridades competentes.
        </p>
      </footer>
    </main>
  );
}
