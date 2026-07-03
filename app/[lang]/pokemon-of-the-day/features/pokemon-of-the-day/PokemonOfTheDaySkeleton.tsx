import { Skeleton } from "@/components/ui/skeleton";

export function PokemonOfTheDaySkeleton() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Skeleton className="h-12 w-40 rounded-2xl" />
      <Skeleton className="h-4 w-48 rounded-full" />
    </div>
  );
}

export function PokemonOfTheDayCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-8 shadow-md w-full max-w-sm">
      <Skeleton className="h-40 w-40 rounded-2xl" />
      <Skeleton className="h-8 w-32 rounded-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-10 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-10 rounded-full" />
      </div>
      <Skeleton className="h-12 w-40 rounded-2xl mt-2" />
    </div>
  );
}
