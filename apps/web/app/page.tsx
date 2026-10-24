import Link from "next/link";

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
    title: "Hablas 5 minutos o 50",
    body: "Si no fluye, pasas al siguiente. Sin culpa y sin dar explicaciones.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col px-6 py-10">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl bg-accent/15 text-accent">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-4.3-1L3 20l1.3-4a8.2 8.2 0 0 1-1.1-4.5 8.4 8.4 0 0 1 8.9-8.4 8.4 8.4 0 0 1 8.9 8.4Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">Parlo</span>
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
          lo que tú estudias y estudia lo que tú hablas. Conversaciones cortas,
          reales, sin agendar.
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

      <footer className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-ink-800 pt-6 text-xs text-ink-500">
        <p>
          Parlo es una plataforma para mayores de 18 años. Moderamos activamente y
          reportamos material de abuso infantil a las autoridades competentes.
        </p>
        <nav className="flex gap-4">
          <Link href="/legal/terminos" className="hover:text-ink-300">Términos</Link>
          <Link href="/legal/privacidad" className="hover:text-ink-300">Privacidad</Link>
          <Link href="/legal/seguridad" className="hover:text-ink-300">Seguridad</Link>
        </nav>
      </footer>
    </main>
  );
}
