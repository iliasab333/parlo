import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, LOCALES, LOCALE_HREFLANG, isLocale, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * Every page in every locale points at the same set of alternates, so
 * Google treats the six as translations of one page rather than six
 * pages competing with each other.
 */
export function localeAlternates(locale: Locale, path = "") {
  return {
    // Each locale is canonical to ITSELF. Pointing them all at the
    // default would tell Google the other five are duplicates of the
    // Spanish page and should not be indexed at all — which would undo
    // the entire translation.
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(
        LOCALES.map((l) => [LOCALE_HREFLANG[l], `/${l}${path}`]),
      ),
      "x-default": `/${DEFAULT_LOCALE}${path}`,
    },
  };
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${t.common.tagline}`,
      template: `%s · ${site.name}`,
    },
    description: t.common.description,
    applicationName: site.name,
    alternates: localeAlternates(locale),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale,
      url: `${site.url}/${locale}`,
      title: `${site.name} — ${t.common.tagline}`,
      description: t.common.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${t.common.tagline}`,
      description: t.common.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    category: "education",
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0f14",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
