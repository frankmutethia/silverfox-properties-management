import { CircleAlert, RotateCw } from "lucide-react";
import type { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Error message with a retry button for a failed load. */
export function LoadError({
  error,
  onRetry,
  className,
}: {
  error: ApiError;
  onRetry: () => void;
  className?: string;
}) {
  return (
    <div role="alert" className={cn("py-12 text-center", className)}>
      <CircleAlert className="mx-auto mb-3 size-6 text-destructive" aria-hidden="true" />
      <p className="font-semibold">This content didn't load.</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{error.message}</p>
      <Button variant="outline" className="mt-5" onClick={onRetry}>
        <RotateCw />
        Try again
      </Button>
    </div>
  );
}

/** Placeholder cards shown while a grid of cards loads. */
export function CardSkeletons({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div
      className={cn("grid gap-6 md:grid-cols-2 xl:grid-cols-3", className)}
      aria-busy="true"
      aria-label="Loading"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-border bg-card">
          <Skeleton className="aspect-[3/2] w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Placeholder lines for text-heavy panels. */
export function LineSkeletons({ lines = 4, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)} aria-busy="true" aria-label="Loading">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} className={cn("h-4", index % 3 === 2 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}
