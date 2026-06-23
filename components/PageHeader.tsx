import Link from "next/link";
import { ReactNode } from "react";
import { t } from "@/lib/i18n";

interface Props {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  rightSlot?: ReactNode;
}

export function PageHeader({ title, subtitle, backHref, backLabel, rightSlot }: Props) {
  return (
    <div className="mb-8">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-pk-yellow/60 hover:text-pk-yellow transition-colors mb-4"
        >
          ← {backLabel ?? t("common.back")}
        </Link>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-pk-yellow tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
          )}
        </div>
        {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
      </div>
    </div>
  );
}
