import { PageContainer } from "@/components/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingState } from "@/components/LoadingState";

export default function Loading() {
  return (
    <PageContainer>
      <div role="status" aria-label="Loading">
        <div className="mb-2">
          <Skeleton className="h-5 w-32 rounded-full mb-4" />
          {/* PageHeader renders an empty title h1 on this page; keep its height. */}
          <div className="h-9" />
        </div>
        <LoadingState variant="detail" />
      </div>
    </PageContainer>
  );
}
