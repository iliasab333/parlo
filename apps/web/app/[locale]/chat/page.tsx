import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChatClient } from "@/components/ChatClient";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";

// The app itself is behind an age gate and has nothing to rank. Keeping
// it out of the index also keeps crawl budget on the pages that do.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ChatPage({ params }: PageProps<"/[locale]/chat">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ChatClient t={getDictionary(locale)} locale={locale} />;
}
