import { PageContainer } from "@/components/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingState } from "@/components/LoadingState";

export default function Loading() {
  return (
    <PageContainer>
      <div role="status" aria-label="Loading">
        <div className="mb-8 flex items-start justify-between gap-4">
          <Skeleton className="h-9 w-48 rounded-xl" />
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Skeleton className="h-9 w-44 rounded-xl" />
            <Skeleton className="h-9 w-44 rounded-xl" />
          </div>
        </div>
        <LoadingState variant="grid" />
      </div>
    </PageContainer>
  );
}
