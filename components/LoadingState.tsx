import { Skeleton } from "@/components/ui/skeleton";
import { ITEM_LIST_PAGE_SIZE, MOVE_LIST_PAGE_SIZE } from "@/lib/constants";

export type LoadingStateVariant = "grid" | "detail" | "type-detail" | "item-list" | "move-list" | "type-grid" | "inline";

interface LoadingStateProps {
  variant?: LoadingStateVariant;
  loadingText?: string;
  /** grid only: reserve the type-badge row rendered on filtered cards. */
  showTypeBadges?: boolean;
}

function PaginationSkeleton() {
  return (
    <div className="mt-10 flex justify-center">
      <Skeleton className="h-8 w-64 rounded-lg" />
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-6">{children}</div>;
}

export function LoadingState({ variant = "inline", loadingText = "Loading…", showTypeBadges = false }: LoadingStateProps) {
  if (variant === "grid") {
    return (
      <div>
        <Skeleton className="h-4 w-24 rounded-full mb-4" />
        <ul className="grid grid-cols-2 gap-4 w-full sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 24 }).map((_, i) => (
            <li key={i} className="rounded-2xl border border-border bg-card shadow-lg shadow-black/30">
              <div className="flex flex-col items-center gap-3 p-5 text-center">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex flex-col items-center gap-1 w-full">
                  {/* Placeholders sized to the real line boxes (text-xs → h-4,
                      text-sm → h-5) so the grid height matches CharacterCard. */}
                  <span className="flex h-4 items-center">
                    <Skeleton className="h-3 w-10 rounded-full" />
                  </span>
                  <span className="flex h-5 items-center">
                    <Skeleton className="h-3.5 w-20 rounded-full" />
                  </span>
                  {showTypeBadges && (
                    <div className="flex gap-1 mt-1">
                      <Skeleton className="h-4 w-10 rounded-full" />
                      <Skeleton className="h-4 w-10 rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <PaginationSkeleton />
      </div>
    );
  }

  if (variant === "item-list") {
    return (
      <div className="w-full">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: ITEM_LIST_PAGE_SIZE }).map((_, i) => (
            <li key={i}>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
                <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                <Skeleton className="h-4 rounded-full flex-1" />
              </div>
            </li>
          ))}
        </ul>
        <PaginationSkeleton />
      </div>
    );
  }

  if (variant === "move-list") {
    return (
      <div className="w-full">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: MOVE_LIST_PAGE_SIZE }).map((_, i) => (
            <li key={i}>
              <Skeleton className="h-11 w-full rounded-xl" />
            </li>
          ))}
        </ul>
        <PaginationSkeleton />
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
        <Skeleton className="h-[88px] w-full rounded-2xl" />
        <SectionCard>
          <Skeleton className="h-4 w-36 rounded-full mb-4" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
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
        </SectionCard>
        <SectionCard>
          <Skeleton className="h-4 w-28 rounded-full mb-4" />
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <li key={i}>
                <Skeleton className="h-11 w-full rounded-xl" />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-start gap-6 rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/30">
          <Skeleton className="h-40 w-40 rounded-full shrink-0" />
          <div className="flex flex-col gap-3 pt-1 flex-1">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-8 w-48 rounded-xl" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-1">
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          </div>
        </div>
        <SectionCard>
          <Skeleton className="h-4 w-24 rounded-full mb-4" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-28 rounded-full shrink-0" />
                <Skeleton className="h-3 w-8 rounded-full shrink-0" />
                <Skeleton className="h-2 flex-1 rounded-full" />
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard>
          <Skeleton className="h-4 w-20 rounded-full mb-3" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </SectionCard>
        <SectionCard>
          <Skeleton className="h-4 w-28 rounded-full mb-3" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <p className="text-sm text-muted-foreground animate-pulse">{loadingText}</p>
  );
}
