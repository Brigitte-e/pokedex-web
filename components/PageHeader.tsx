"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  titleKey?: string;
  subtitleKey?: string;
  subtitleParams?: Record<string, string | number>;
  backHref?: string;
  backLabelKey?: string;
  rightSlot?: ReactNode;
}

const PageHeader = ({
  titleKey,
  subtitleKey,
  subtitleParams,
  backHref,
  backLabelKey = "common.back",
  rightSlot,
}: Props) => {
  const { t } = useTranslation();
  return (
    <div className="mb-8">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-pk-yellow/60 hover:text-pk-yellow transition-colors mb-4"
        >
          ← {t(backLabelKey)}
        </Link>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          {titleKey && (
            <h1 className="text-3xl font-bold text-pk-yellow tracking-tight">
              {t(titleKey)}
            </h1>
          )}
          {subtitleKey && (
            <p className="text-muted-foreground mt-1 text-sm">
              {t(subtitleKey, subtitleParams)}
            </p>
          )}
        </div>
        {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
      </div>
    </div>
  );
};

export { PageHeader };
