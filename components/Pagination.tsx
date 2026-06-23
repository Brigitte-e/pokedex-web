import { Button } from "@/components/ui/button";

export interface PaginationProps {
  page: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function Pagination({
  page,
  totalPages,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: PaginationProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="sm" onClick={onPrevious} disabled={!hasPrevious}>
        ← Previous
      </Button>
      <span className="text-sm font-medium text-pk-yellow/70 tabular-nums">
        {page} / {totalPages}
      </span>
      <Button variant="outline" size="sm" onClick={onNext} disabled={!hasNext}>
        Next →
      </Button>
    </div>
  );
}
