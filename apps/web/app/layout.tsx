import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parlo — Practica idiomas con hablantes nativos",
  description:
    "Conversaciones cortas y aleatorias con hablantes nativos de todo el mundo. Solo mayores de 18 años.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
