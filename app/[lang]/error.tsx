"use client";

import { PageContainer } from "@/components/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-lg font-semibold text-destructive">{t("error.title")}</p>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-pk-red px-6 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
        >
          {t("error.retry")}
        </button>
      </div>
    </PageContainer>
  );
}
