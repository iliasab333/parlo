import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COUNTRY_VARIANTS, findVariant, variantsFor } from "@/lib/countries";
import { fill, getDictionary } from "@/lib/dictionaries";
import { LOCALES, isLocale } from "@/lib/i18n";
import { LANGUAGE_PAGES, pageBySlug } from "@/lib/languages";
import { absolute, site } from "@/lib/site";
import { localeAlternates } from "../../../layout";

/**
 * Only languages with a genuinely different variant per country have
 * these pages — see lib/countries.ts for why that restraint matters.
 */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    COUNTRY_VARIANTS.flatMap((v) => {
      const page = LANGUAGE_PAGES.find((p) => p.code === v.language);
      return page ? [{ locale, idioma: page.slug, pais: v.slug }] : [];
    }),
  );
}

async function resolve(params: Promise<{ locale: string; idioma: string; pais: string }>) {
  const { locale, idioma, pais } = await params;
  if (!isLocale(locale)) return null;
  const page = pageBySlug(idioma);
  if (!page) return null;
  const variant = findVariant(page.code, pais);
  if (!variant) return null;
  return { locale, page, variant };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/practicar/[idioma]/[pais]">): Promise<Metadata> {
  const resolved = await resolve(params);
  if (!resolved) return {};
  const { locale, page, variant } = resolved;

  const t = getDictionary(locale);
  const values = { lang: page.nombre, people: variant.gentilicio };
  const title = fill(t.country.titleTemplate, values);
  const description = fill(t.country.descriptionTemplate, values);

  return {
    title,
    description,
    alternates: localeAlternates(locale, `/practicar/${page.slug}/${variant.slug}`),
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: absolute(`/${locale}/practicar/${page.slug}/${variant.slug}`),
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CountryPage({
  params,
}: PageProps<"/[locale]/practicar/[idioma]/[pais]">) {
  const resolved = await resolve(params);
  if (!resolved) notFound();
  const { locale, page, variant } = resolved;

  const t = getDictionary(locale);
  const values = { lang: page.nombre, people: variant.gentilicio };
  const title = fill(t.country.titleTemplate, values);
  const siblings = variantsFor(page.code).filter((v) => v.slug !== variant.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.practise.breadcrumbHome, item: absolute(`/${locale}`) },
      {
        "@type": "ListItem",
        position: 2,
        name: fill(t.practise.h1Template, { lang: page.nombre }),
        item: absolute(`/${locale}/practicar/${page.slug}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: variant.pais,
        item: absolute(`/${locale}/practicar/${page.slug}/${variant.slug}`),
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-10 flex flex-wrap items-center gap-x-2 text-sm text-ink-500">
        <Link href={`/${locale}`} className="hover:text-ink-300">{site.name}</Link>
        <span>/</span>
        <Link href={`/${locale}/practicar/${page.slug}`} className="hover:text-ink-300">
          {page.nombre}
        </Link>
        <span>/</span>
        <span className="text-ink-300">{variant.pais}</span>
      </nav>

      <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {title}
      </h1>

      <p className="mt-4 leading-relaxed text-ink-500">{t.practise.intro}</p>

      {/* The accent and timezone notes are the reason this page exists
          rather than being a slice of the language page. They are
          written in Spanish for a Spanish-speaking audience; other
          locales get the page without them rather than a machine
          translation of something this specific. */}
      {locale === "es" && (
        <>
          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">{t.country.accentTitle}</h2>
            <p className="mt-3 leading-relaxed text-ink-300">{variant.acento}</p>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">{t.country.scheduleTitle}</h2>
            <p className="mt-3 leading-relaxed text-ink-300">{variant.horario}</p>
          </section>
        </>
      )}

      <div className="mt-12 flex flex-wrap items-center gap-3">
        <Link
          href={`/${locale}/chat`}
          className="rounded-xl bg-accent px-6 py-3.5 font-semibold text-ink-950 transition hover:brightness-110"
        >
          {fill(t.country.ctaTemplate, values)}
        </Link>
        <span className="text-sm text-ink-500">
          {t.common.free} · {t.common.adultsOnly}
        </span>
      </div>

      {siblings.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">{t.country.otherVariants}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {siblings.map((v) => (
              <Link
                key={v.slug}
                href={`/${locale}/practicar/${page.slug}/${v.slug}`}
                className="rounded-lg border border-ink-700 px-3 py-1.5 text-sm text-ink-300 transition hover:border-accent hover:text-accent"
              >
                {v.pais}
              </Link>
            ))}
            <Link
              href={`/${locale}/practicar/${page.slug}`}
              className="rounded-lg border border-ink-700 px-3 py-1.5 text-sm text-ink-300 transition hover:border-accent hover:text-accent"
            >
              {fill(t.country.allSpeakersTemplate, { lang: page.nombre })}
            </Link>
          </div>
        </section>
      )}

      <footer className="mt-16 border-t border-ink-800 pt-6 text-xs leading-relaxed text-ink-500">
        {t.home.footer}
      </footer>
    </main>
  );
}
