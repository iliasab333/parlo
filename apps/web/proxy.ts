import { NextResponse, type NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/lib/i18n";

/**
 * `middleware.ts` is deprecated in Next 16; this is its replacement.
 *
 * Every path carries a locale prefix, so an incoming request without
 * one is redirected to the best match for the visitor's browser. The
 * choice is remembered in a cookie: someone who deliberately switches
 * language should not be sent back by their Accept-Language header on
 * the next visit.
 */
const COOKIE = "parlo.locale";

function detectLocale(request: NextRequest): string {
  const saved = request.cookies.get(COOKIE)?.value;
  if (saved && isLocale(saved)) return saved;

  const header = request.headers.get("accept-language");
  if (!header) return DEFAULT_LOCALE;

  try {
    const languages = new Negotiator({
      headers: { "accept-language": header },
    }).languages();
    return matchLocale(languages, LOCALES as unknown as string[], DEFAULT_LOCALE);
  } catch {
    // A malformed Accept-Language must not take the site down.
    return DEFAULT_LOCALE;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  if (hasLocale) {
    // Keep the cookie in step with the path the visitor actually chose.
    const current = pathname.split("/")[1];
    const response = NextResponse.next();
    if (request.cookies.get(COOKIE)?.value !== current) {
      response.cookies.set(COOKIE, current, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals and anything with a file extension, so
  // /sitemap.xml, /robots.txt and static assets are never prefixed.
  matcher: ["/((?!_next|.*\\..*).*)"],
};
