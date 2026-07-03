"use client";

import { useParams } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";
import { DEFAULT_LOCALE } from "@/lib/constants";
import type { Locale } from "@/lib/constants";

// error.tsx renders when the server dictionary is unavailable, so messages live inline.
const MESSAGES: Record<Locale, { title: string; retry: string }> = {
  en: { title: "Something went wrong.", retry: "Try again" },
  es: { title: "Algo salió mal.", retry: "Intentar de nuevo" },
  de: { title: "Etwas ist schiefgelaufen.", retry: "Erneut versuchen" },
};

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang } = useParams<{ lang: string }>();
  const messages = MESSAGES[lang as Locale] ?? MESSAGES[DEFAULT_LOCALE];

  return (
    <PageContainer>
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-lg font-semibold text-destructive">{messages.title}</p>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-pk-red px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
        >
          {messages.retry}
        </button>
      </div>
    </PageContainer>
  );
}
