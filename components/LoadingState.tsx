import { Skeleton } from "@/components/ui/skeleton";

export type LoadingStateVariant = "grid" | "detail" | "inline";

interface LoadingStateProps {
  variant?: LoadingStateVariant;
}

export function LoadingState({ variant = "inline" }: LoadingStateProps) {
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-2 gap-4 w-full max-w-3xl sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
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
      <div className="flex flex-col gap-6 w-full max-w-2xl">
        <div className="flex items-start gap-6 rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-36 w-36 rounded-2xl shrink-0" />
          <div className="flex flex-col gap-3 pt-1 flex-1">
            <Skeleton className="h-7 w-48 rounded-xl" />
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
  );
}
