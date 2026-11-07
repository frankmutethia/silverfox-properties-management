import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function Pager({
  pagination,
  onPage,
  disabled = false,
}: {
  pagination: Pagination | undefined;
  onPage: (page: number) => void;
  disabled?: boolean;
}) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages } = pagination;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-end gap-3 py-4">
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || page <= 1}
        onClick={() => onPage(page - 1)}
      >
        <ChevronLeft />
        Previous
      </Button>
      <span className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || page >= totalPages}
        onClick={() => onPage(page + 1)}
      >
        Next
        <ChevronRight />
      </Button>
    </nav>
  );
}
