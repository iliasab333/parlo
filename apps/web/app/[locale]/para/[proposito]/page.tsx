import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fill, getDictionary } from "@/lib/dictionaries";
import { LOCALES, isLocale } from "@/lib/i18n";
import { LANGUAGE_PAGES } from "@/lib/languages";
import { PURPOSES, findPurpose } from "@/lib/purposes";
import { languageName } from "@/lib/names";
import { absolute, site } from "@/lib/site";
import { localeAlternates } from "../../layout";

/**
 * One hub per purpose, linking out to every language — rather than a
 * page per language × purpose, which would be a hundred near-identical
 * pages and the quickest route to being read as a doorway farm.
 */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    PURPOSES.map((p) => ({ locale, proposito: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/para/[proposito]">): Promise<Metadata> {
  const { locale, proposito } = await params;
  if (!isLocale(locale)) return {};
  const purpose = findPurpose(proposito);
  if (!purpose) return {};

  const t = getDictionary(locale);
  const label = t.purpose.labels[purpose.slug];
  const title = label.title;
  const description = locale === "es" ? purpose.problema.slice(0, 155) : t.common.description;

  return {
    title,
    description,
    alternates: localeAlternates(locale, `/para/${purpose.slug}`),
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: absolute(`/${locale}/para/${purpose.slug}`),
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PurposePage({
  params,
}: PageProps<"/[locale]/para/[proposito]">) {
  const { locale, proposito } = await params;
  if (!isLocale(locale)) notFound();
  const purpose = findPurpose(proposito);
  if (!purpose) notFound();

  const t = getDictionary(locale);
  const others = PURPOSES.filter((p) => p.slug !== purpose.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t.practise.breadcrumbHome, item: absolute(`/${locale}`) },
          {
            "@type": "ListItem",
            position: 2,
            name: t.purpose.labels[purpose.slug].title,
            item: absolute(`/${locale}/para/${purpose.slug}`),
          },
        ],
      },
      // The tips are the substance of the page, so they are marked up
      // as such rather than left as an anonymous list.
      {
        "@type": "HowTo",
        name: t.purpose.labels[purpose.slug].title,
        step: purpose.consejos.map((c, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          text: c,
        })),
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-10 text-sm text-ink-500">
        <Link href={`/${locale}`} className="hover:text-ink-300">{site.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-ink-300">{t.purpose.labels[purpose.slug].name}</span>
      </nav>

      <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {t.purpose.labels[purpose.slug].title}
      </h1>

      {/* The problem statement and the tips are bespoke Spanish copy.
          Other locales get the structure and the links; writing five
          machine translations of advice this specific would be worse
          than not having it. */}
      {locale === "es" ? (
        <>
          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">{t.purpose.problemTitle}</h2>
            <p className="mt-3 text-lg leading-relaxed text-ink-300">{purpose.problema}</p>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">{t.purpose.tipsTitle}</h2>
            <ul className="mt-5 space-y-4">
              {purpose.consejos.map((c, i) => (
                <li key={c} className="flex gap-4">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-ink-800 text-xs font-semibold text-accent">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-ink-300">{c}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        <p className="mt-5 text-lg leading-relaxed text-ink-300">{t.purpose.hubLede}</p>
      )}

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">{t.purpose.languagesTitle}</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {LANGUAGE_PAGES.map((p) => (
            <Link
              key={p.slug}
              href={`/${locale}/practicar/${p.slug}`}
              className="rounded-lg border border-ink-700 px-3.5 py-2 text-sm text-ink-300 transition hover:border-accent hover:text-accent"
            >
              {languageName(locale, p.code)}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-3">
        <Link
          href={`/${locale}/chat`}
          className="rounded-xl bg-accent px-6 py-3.5 font-semibold text-ink-950 transition hover:brightness-110"
        >
          {t.home.cta}
        </Link>
        <span className="text-sm text-ink-500">
          {t.common.free} · {t.common.adultsOnly}
        </span>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">{t.purpose.otherPurposes}</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {others.map((p) => (
            <Link
              key={p.slug}
              href={`/${locale}/para/${p.slug}`}
              className="rounded-lg border border-ink-700 px-3 py-1.5 text-sm text-ink-300 transition hover:border-accent hover:text-accent"
            >
              {t.purpose.labels[p.slug].name}
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-ink-800 pt-6 text-xs leading-relaxed text-ink-500">
        {t.home.footer}
      </footer>
    </main>
  );
}

export { fill };
