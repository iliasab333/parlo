import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fill, getDictionary } from "@/lib/dictionaries";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n";
import { variantsFor } from "@/lib/countries";
import { LANGUAGE_PAGES, pageBySlug } from "@/lib/languages";
import { countryName, languageName, languageWithArticle } from "@/lib/names";
import { absolute, site } from "@/lib/site";
import { localeAlternates } from "../../layout";

// Every locale × language combination is known at build time, so they
// all prerender as static HTML.
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    LANGUAGE_PAGES.map((p) => ({ locale, idioma: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/practicar/[idioma]">): Promise<Metadata> {
  const { locale, idioma } = await params;
  if (!isLocale(locale)) return {};
  const page = pageBySlug(idioma);
  if (!page) return {};

  const t = getDictionary(locale);
  const lang = languageName(locale, page.code);
  const langA = languageWithArticle(locale, page.code);
  const title = fill(t.practise.titleTemplate, { lang, langA });
  const description = fill(t.practise.descriptionTemplate, { lang, langA });

  return {
    title,
    description,
    alternates: localeAlternates(locale, `/practicar/${page.slug}`),
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: absolute(`/${locale}/practicar/${page.slug}`),
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LanguagePage({
  params,
}: PageProps<"/[locale]/practicar/[idioma]">) {
  const { locale, idioma } = await params;
  if (!isLocale(locale)) notFound();
  const page = pageBySlug(idioma);
  if (!page) notFound();

  const t = getDictionary(locale);
  const lang = languageName(locale, page.code);
  const langA = languageWithArticle(locale, page.code);
  const otras = LANGUAGE_PAGES.filter((p) => p.slug !== page.slug).slice(0, 9);
  const variants = variantsFor(page.code);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: t.practise.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t.practise.breadcrumbHome,
            item: absolute(`/${locale}`),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: fill(t.practise.h1Template, { lang, langA }),
            item: absolute(`/${locale}/practicar/${page.slug}`),
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
        <Link href={`/${locale}`} className="hover:text-ink-300">
          {site.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-300">{fill(t.home.practiceVerb + " {lang}", { lang, langA })}</span>
      </nav>

      <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {fill(t.practise.h1Template, { lang, langA })}
      </h1>

      {/* The bespoke hook is written in Spanish for a Spanish-speaking
          audience. Rather than machine-translate it into five languages,
          other locales get the general introduction only. */}
      {locale === "es" && (
        <p className="mt-5 text-lg leading-relaxed text-ink-300">{page.gancho}</p>
      )}

      <p className="mt-4 leading-relaxed text-ink-500">{t.practise.intro}</p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href={`/${locale}/chat`}
          className="rounded-xl bg-accent px-6 py-3.5 font-semibold text-ink-950 transition hover:brightness-110"
        >
          {fill(t.practise.ctaTemplate, { lang, langA })}
        </Link>
        <span className="text-sm text-ink-500">
          {t.common.free} · {t.common.adultsOnly}
        </span>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">{t.practise.howTitle}</h2>
        <ol className="mt-5 space-y-4">
          {t.practise.howSteps.map((paso, i) => (
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
        <h2 className="text-2xl font-semibold tracking-tight">{t.home.faqTitle}</h2>
        <div className="mt-5 divide-y divide-ink-800 border-y border-ink-800">
          {t.practise.faq.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none font-medium marker:content-none">
                <span className="transition group-open:text-accent">{item.q}</span>
              </summary>
              <p className="mt-2.5 leading-relaxed text-ink-500">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {variants.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">{t.country.otherVariants}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {variants.map((v) => (
              <Link
                key={v.slug}
                href={`/${locale}/practicar/${page.slug}/${v.slug}`}
                className="rounded-lg border border-ink-700 px-3.5 py-2 text-sm text-ink-300 transition hover:border-accent hover:text-accent"
              >
                {countryName(locale, v.region)}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight">{t.practise.otherLanguages}</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {otras.map((p) => (
            <Link
              key={p.slug}
              href={`/${locale}/practicar/${p.slug}`}
              className="rounded-lg border border-ink-700 px-3 py-1.5 text-sm text-ink-300 transition hover:border-accent hover:text-accent"
            >
              {languageName(locale, p.code)}
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

export type { Locale };
