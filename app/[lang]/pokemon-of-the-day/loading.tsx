import { PageContainer } from "@/components/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { PokemonOfTheDayCardSkeleton } from "./features/pokemon-of-the-day/PokemonOfTheDaySkeleton";

export default function Loading() {
  return (
    <PageContainer>
      <div role="status" aria-label="Loading">
        <Skeleton className="h-9 w-64 rounded-xl mb-2" />
        <Skeleton className="h-4 w-48 rounded-full mb-8" />
        <PokemonOfTheDayCardSkeleton />
      </div>
    </PageContainer>
  );
}
