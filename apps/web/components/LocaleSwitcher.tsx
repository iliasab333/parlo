"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALES, LOCALE_NAMES, stripLocale, type Locale } from "@/lib/i18n";

/**
 * Auto-detection gets it right most of the time and wrong the rest —
 * a Spaniard on a borrowed laptop, someone whose browser is English
 * but who reads Portuguese. The override has to be visible, and the
 * proxy writes the choice to a cookie so it survives the next visit.
 */
export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="flex items-center gap-1.5 text-xs text-ink-500">
      <span className="sr-only">{label}</span>
      <select
        value={locale}
        onChange={(e) => router.push(`/${e.target.value}${stripLocale(pathname)}`)}
        aria-label={label}
        className="rounded-lg border border-ink-700 bg-ink-900 px-2 py-1 text-xs text-ink-300 outline-none transition hover:border-ink-500 focus:border-accent"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} className="bg-ink-900 text-ink-100">
            {LOCALE_NAMES[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
