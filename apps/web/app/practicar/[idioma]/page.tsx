import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LANGUAGE_PAGES, pageBySlug } from "@/lib/languages";
import { absolute, site } from "@/lib/site";

// Every language page is known at build time, so they prerender as
// static HTML — the cheapest thing to serve and to crawl.
export function generateStaticParams() {
  return LANGUAGE_PAGES.map((p) => ({ idioma: p.slug }));
}

type Params = Promise<{ idioma: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { idioma } = await params;
  const page = pageBySlug(idioma);
  if (!page) return {};

  const title = `Practicar ${page.nombre} con nativos por videochat`;
  const description = `Habla ${page.nombre} con ${page.hablantes} que están aprendiendo español. Emparejamiento aleatorio, gratis, sin agendar. Solo mayores de 18 años.`;
  const url = absolute(`/practicar/${page.slug}`);

  return {
    title,
    description,
    alternates: { canonical: `/practicar/${page.slug}` },
    openGraph: { title: `${title} · ${site.name}`, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

function faqFor(nombre: string) {
  return [
    {
      q: `¿Es gratis practicar ${nombre} en Parlo?`,
      a: `Sí. El emparejamiento y las conversaciones son gratuitas. Parlo funciona por reciprocidad: tú ofreces tu español a alguien que lo estudia y esa persona te ofrece su ${nombre}.`,
    },
    {
      q: `¿Necesito un nivel mínimo de ${nombre}?`,
      a: `No. Eliges tu nivel al empezar y el emparejamiento prioriza a personas de nivel parecido, para que la conversación no sea frustrante para ninguno de los dos.`,
    },
    {
      q: "¿Hay que registrarse?",
      a: "No hace falta crear una cuenta para empezar. Sí hay que confirmar que eres mayor de 18 años: Parlo empareja desconocidos por vídeo y es una plataforma exclusivamente para adultos.",
    },
    {
      q: "¿Puedo elegir con quién hablo?",
      a: "Puedes filtrar por idioma, por género y pedir que se priorice a personas de otro país. El filtro de género se respeta en ambos sentidos y nunca se amplía automáticamente, por larga que sea la espera.",
    },
    {
      q: "¿Se graban las conversaciones?",
      a: "No. El vídeo y el audio viajan directamente entre los dos navegadores mediante WebRTC; el servidor solo hace de intermediario para establecer la conexión y nunca ve ni almacena el contenido.",
    },
  ];
}

export default async function LanguagePage({ params }: { params: Params }) {
  const { idioma } = await params;
  const page = pageBySlug(idioma);
  if (!page) notFound();

  const faq = faqFor(page.nombre);
  const otras = LANGUAGE_PAGES.filter((p) => p.slug !== page.slug).slice(0, 9);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: absolute("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: `Practicar ${page.nombre}`,
            item: absolute(`/practicar/${page.slug}`),
          },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-10 text-sm text-ink-500">
        <Link href="/" className="hover:text-ink-300">
          Parlo
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-300">Practicar {page.nombre}</span>
      </nav>

      <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        Practicar {page.nombre} hablando con nativos
      </h1>

      <p className="mt-5 text-lg leading-relaxed text-ink-300">{page.gancho}</p>

      <p className="mt-4 leading-relaxed text-ink-500">
        Parlo te empareja al azar con {page.hablantes} que están aprendiendo
        español. Ellos practican contigo, tú practicas con ellos y la
        conversación dura lo que los dos queráis que dure.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/chat"
          className="rounded-xl bg-accent px-6 py-3.5 font-semibold text-ink-950 transition hover:brightness-110"
        >
          Empezar a hablar {page.nombre}
        </Link>
        <span className="text-sm text-ink-500">Gratis · Solo +18</span>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">Cómo funciona</h2>
        <ol className="mt-5 space-y-4">
          {[
            `Dices que hablas español y que practicas ${page.nombre}.`,
            "Te emparejamos con alguien cuyo perfil es el tuyo al revés.",
            "Habláis. Si no fluye, pasas al siguiente sin dar explicaciones.",
          ].map((paso, i) => (
            <li key={paso} className="flex gap-4">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-ink-800 text-xs font-semibold text-accent">
                {i + 1}
              </span>
              <span className="leading-relaxed text-ink-300">{paso}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">Preguntas frecuentes</h2>
        <div className="mt-5 divide-y divide-ink-800 border-y border-ink-800">
          {faq.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none font-medium marker:content-none">
                <span className="transition group-open:text-accent">{item.q}</span>
              </summary>
              <p className="mt-2.5 leading-relaxed text-ink-500">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">Otros idiomas</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {otras.map((p) => (
            <Link
              key={p.slug}
              href={`/practicar/${p.slug}`}
              className="rounded-lg border border-ink-700 px-3 py-1.5 text-sm text-ink-300 transition hover:border-accent hover:text-accent"
            >
              {p.nombre}
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-ink-800 pt-6 text-xs leading-relaxed text-ink-500">
        Parlo es una plataforma para mayores de 18 años. Moderamos activamente,
        no grabamos las conversaciones y reportamos material de abuso infantil a
        las autoridades competentes.
      </footer>
    </main>
  );
}
