import { ImageResponse } from "next/og";
import { getDictionary } from "@/lib/dictionaries";
import { LOCALES, isLocale } from "@/lib/i18n";
import { site } from "@/lib/site";

export const alt = site.name;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "es");
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

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, maxWidth: 940 }}>
            {t.home.headline}
          </div>
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, color: "#34d399" }}>
            {t.home.headlineMuted}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, fontSize: 22, color: "#9aa7b2" }}>
          <div
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid #2a3540",
              display: "flex",
            }}
          >
{t.common.adultsOnly}
          </div>
          <div
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid #2a3540",
              display: "flex",
            }}
          >
20 · 6
          </div>
          <div
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid #2a3540",
              display: "flex",
            }}
          >
{t.common.free}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
