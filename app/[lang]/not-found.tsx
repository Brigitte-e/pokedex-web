"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/constants";
import type { Locale } from "@/lib/constants";

// not-found.tsx receives no params server-side, so messages live inline.
const MESSAGES: Record<Locale, { title: string; home: string }> = {
  en: { title: "Page not found.", home: "Back to Pokédex" },
  es: { title: "Página no encontrada.", home: "Volver a la Pokédex" },
  de: { title: "Seite nicht gefunden.", home: "Zurück zum Pokédex" },
};

export default function NotFound() {
  const params = useParams<{ lang?: string }>();
  const locale = (LOCALES as readonly string[]).includes(params?.lang ?? "")
    ? (params!.lang as Locale)
    : DEFAULT_LOCALE;
  const messages = MESSAGES[locale];

  return (
    <PageContainer>
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-6xl font-black text-muted-foreground select-none">404</p>
        <p className="text-lg font-semibold">{messages.title}</p>
        <Link
          href={`/${locale}/pokemon`}
          className="rounded-xl bg-pk-yellow/20 px-6 py-2.5 text-sm font-semibold text-pk-yellow hover:bg-pk-yellow/30 transition"
        >
          {messages.home}
        </Link>
      </div>
    </PageContainer>
  );
}
