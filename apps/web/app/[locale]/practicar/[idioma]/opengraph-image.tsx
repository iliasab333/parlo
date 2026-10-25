import { ImageResponse } from "next/og";
import { LANGUAGE_PAGES, pageBySlug } from "@/lib/languages";
import { getDictionary } from "@/lib/dictionaries";
import { LOCALES, isLocale } from "@/lib/i18n";
import { site } from "@/lib/site";

export const alt = "Practicar idiomas con nativos en Parlo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Prerender one image per language alongside its page.
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    LANGUAGE_PAGES.map((p) => ({ locale, idioma: p.slug })),
  );
}

export default async function LanguageOpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string; idioma: string }>;
}) {
  const { locale, idioma } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "es");
  const page = pageBySlug(idioma);
  const nombre = page?.nombre ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(900px 600px at 10% -10%, #0f3f36 0%, transparent 60%), radial-gradient(700px 500px at 100% 0%, #2a1f4a 0%, transparent 60%), #0b0f14",
          color: "#eef2f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(52, 211, 153, 0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
            }}
          >
            💬
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>{site.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 34, color: "#9aa7b2", display: "flex" }}>{t.home.practiceVerb}</div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -3,
              color: "#34d399",
              display: "flex",
            }}
          >
            {nombre}
          </div>
          <div style={{ fontSize: 30, color: "#9aa7b2", maxWidth: 820, lineHeight: 1.35 }}>
{t.common.tagline}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, fontSize: 22, color: "#9aa7b2" }}>
          {[t.common.adultsOnly, t.common.free].map((chip) => (
            <div
              key={chip}
              style={{
                padding: "8px 18px",
                borderRadius: 999,
                border: "1px solid #2a3540",
                display: "flex",
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
