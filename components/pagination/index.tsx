"use client";

import { Button } from "@/components/ui/button";
import { getVisiblePages } from "./pagination";
import { cn } from "@/lib/utils/cn";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  page: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  page,
  totalPages,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onPageChange,
}: Props) => {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <nav
      aria-label={t("common.pagination")}
      className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-center sm:gap-2"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={!hasPrevious}
        aria-label={t("common.previous")}
        className="shrink-0 px-2.5 sm:px-3"
      >
        <span className="sm:hidden">←</span>
        <span className="hidden sm:inline">{t("common.previous")}</span>
      </Button>

      <p
        className="shrink-0 text-sm font-medium tabular-nums text-foreground sm:hidden"
        aria-current="page"
      >
        {t("common.pageOfTotal", { page, total: totalPages })}
      </p>

      <div className="hidden items-center gap-1 sm:flex">
        {visiblePages.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-1 text-sm text-muted-foreground select-none"
                aria-hidden
              >
                …
              </span>
            );
          }

          const isActive = item === page;

          return (
            <Button
              key={item}
              variant="outline"
              size="sm"
              onClick={() => !isActive && onPageChange(item)}
              aria-current={isActive ? "page" : undefined}
              tabIndex={isActive ? -1 : undefined}
              className={cn(
                "min-w-8 px-2 tabular-nums",
                isActive &&
                  "pointer-events-none border-pk-yellow bg-pk-yellow text-pk-dark shadow-md shadow-black/30 hover:bg-pk-yellow hover:text-pk-dark",
              )}
            >
              {item}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={!hasNext}
        aria-label={t("common.next")}
        className="shrink-0 px-2.5 sm:px-3"
      >
        <span className="sm:hidden">→</span>
        <span className="hidden sm:inline">{t("common.next")}</span>
      </Button>
    </nav>
  );
};

export { Pagination };
