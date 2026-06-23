import { Skeleton } from "@/components/ui/skeleton";

export type LoadingStateVariant = "grid" | "detail" | "inline";

interface LoadingStateProps {
  variant?: LoadingStateVariant;
}

export function LoadingState({ variant = "inline" }: LoadingStateProps) {
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-2 gap-4 w-full sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3 p-5">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className="flex flex-col gap-6 w-full max-w-3xl">
        <div className="flex items-start gap-6 rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-40 w-40 rounded-2xl shrink-0" />
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
    <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
  );
}
