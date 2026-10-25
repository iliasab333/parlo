import Link from "next/link";
import { notFound } from "next/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { LANGUAGE_PAGES } from "@/lib/languages";
import { languageName } from "@/lib/names";
import { PURPOSES } from "@/lib/purposes";
import { absolute, site } from "@/lib/site";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: site.name,
        url: absolute(`/${locale}`),
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        inLanguage: locale,
        description: t.common.description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        audience: { "@type": "PeopleAudience", suggestedMinAge: 18 },
      },
      {
        "@type": "FAQPage",
        mainEntity: t.home.faq.map((item) => ({
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

      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl bg-accent/15 text-accent">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-4.3-1L3 20l1.3-4a8.2 8.2 0 0 1-1.1-4.5 8.4 8.4 0 0 1 8.9-8.4 8.4 8.4 0 0 1 8.9 8.4Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">{site.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <LocaleSwitcher locale={locale} label={t.common.languageLabel} />
          <span className="rounded-full border border-ink-700 px-3 py-1 text-xs font-medium text-ink-300">
            {t.common.adultsOnly}
          </span>
        </div>
      </header>

      <section className="flex flex-1 flex-col justify-center py-16">
        <p className="mb-4 text-sm font-medium uppercase tracking-wide text-accent">
          {t.home.eyebrow}
        </p>
        <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          {t.home.headline}
          <span className="block text-ink-500">{t.home.headlineMuted}</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300">{t.home.lede}</p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href={`/${locale}/chat`}
            className="rounded-xl bg-accent px-6 py-3.5 font-semibold text-ink-950 transition hover:brightness-110"
          >
            {t.home.cta}
          </Link>
          <span className="text-sm text-ink-500">{t.home.ctaNote}</span>
        </div>
      </section>

      <section className="grid gap-5 border-t border-ink-800 pt-12 sm:grid-cols-3">
        {t.home.steps.map((step, i) => (
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
        <h2 className="text-2xl font-semibold tracking-tight">{t.home.languagesTitle}</h2>
        <p className="mt-2 text-sm text-ink-500">{t.home.languagesLede}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {LANGUAGE_PAGES.map((p) => (
            <Link
              key={p.slug}
              href={`/${locale}/practicar/${p.slug}`}
              className="rounded-lg border border-ink-700 px-3.5 py-2 text-sm text-ink-300 transition hover:border-accent hover:text-accent"
            >
              {t.home.practiceVerb} {languageName(locale, p.code)}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-ink-800 pt-12">
        <h2 className="text-2xl font-semibold tracking-tight">{t.purpose.hubTitle}</h2>
        <p className="mt-2 text-sm text-ink-500">{t.purpose.hubLede}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {PURPOSES.map((p) => (
            <Link
              key={p.slug}
              href={`/${locale}/para/${p.slug}`}
              className="rounded-lg border border-ink-700 px-3.5 py-2 text-sm text-ink-300 transition hover:border-accent hover:text-accent"
            >
              {t.purpose.labels[p.slug].name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-ink-800 pt-12">
        <h2 className="text-2xl font-semibold tracking-tight">{t.home.faqTitle}</h2>
        <div className="mt-5 divide-y divide-ink-800 border-y border-ink-800">
          {t.home.faq.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none font-medium marker:content-none">
                <span className="transition group-open:text-accent">{item.q}</span>
              </summary>
              <p className="mt-2.5 max-w-2xl leading-relaxed text-ink-500">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="mt-14 border-t border-ink-800 pt-6 text-xs leading-relaxed text-ink-500">
        <p className="max-w-xl">{t.home.footer}</p>
      </footer>
    </main>
  );
}
