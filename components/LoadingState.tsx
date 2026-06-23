import { Skeleton } from "@/components/ui/skeleton";
import { t } from "@/lib/i18n";

export type LoadingStateVariant = "grid" | "detail" | "type-detail" | "item-list" | "move-list" | "type-grid" | "inline";

interface LoadingStateProps {
  variant?: LoadingStateVariant;
}

export function LoadingState({ variant = "inline" }: LoadingStateProps) {
  if (variant === "grid") {
    return (
      <div>
        <Skeleton className="h-5 w-24 rounded-full mb-4" />
        <ul className="grid grid-cols-2 gap-4 w-full sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 24 }).map((_, i) => (
            <li key={i} className="rounded-2xl border border-border bg-card shadow-lg shadow-black/30">
              <div className="flex flex-col items-center gap-3 p-5 text-center">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex flex-col items-center gap-1 w-full">
                  <Skeleton className="h-3 w-10 rounded-full" />
                  <Skeleton className="h-4 w-20 rounded-full" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === "item-list") {
    return (
      <div className="w-full">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <li key={i}>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
                <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                <Skeleton className="h-4 rounded-full flex-1" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === "move-list") {
    return (
      <div className="w-full">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <li key={i}>
              <Skeleton className="h-11 w-full rounded-xl" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === "type-grid") {
    return (
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 19 }).map((_, i) => (
          <li key={i}>
            <Skeleton className="h-[60px] w-full rounded-2xl" />
          </li>
        ))}
      </ul>
    );
  }

  if (variant === "type-detail") {
    return (
      <div className="flex flex-col gap-6 w-full">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-4 w-36 rounded-full mb-4" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-3 w-32 rounded-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className="flex flex-col gap-6 w-full max-w-3xl">
        <div className="flex items-start gap-6 rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-40 w-40 rounded-full shrink-0" />
          <div className="flex flex-col gap-3 pt-1 flex-1">
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-8 w-48 rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <p className="text-sm text-muted-foreground animate-pulse">{t("common.loading")}</p>
  );
}
