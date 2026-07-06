"use client";

import Link from "next/link";
import { PageContainer } from "@/components/PageContainer";
import { useTranslation } from "@/hooks/useTranslation";

export default function NotFound() {
  const { t, locale } = useTranslation();

  return (
    <PageContainer>
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-6xl font-black text-muted-foreground select-none">404</p>
        <p className="text-lg font-semibold">{t("notFound.title")}</p>
        <Link
          href={`/${locale}/pokemon`}
          className="rounded-xl bg-pk-yellow/20 px-6 py-2.5 text-sm font-semibold text-pk-yellow hover:bg-pk-yellow/30 transition"
        >
          {t("notFound.home")}
        </Link>
      </div>
    </PageContainer>
  );
}
