import { PageContainer } from "@/components/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingState } from "@/components/LoadingState";

export default function Loading() {
  return (
    <PageContainer>
      <div role="status" aria-label="Loading">
        <Skeleton className="h-9 w-32 rounded-xl mb-2" />
        <Skeleton className="h-4 w-56 rounded-full mb-8" />
        <LoadingState variant="item-list" />
      </div>
    </PageContainer>
  );
}
