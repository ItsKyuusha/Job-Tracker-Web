import { Skeleton } from "@/components/ui/skeleton";

export default function JobsLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in-50 duration-200">
      {/* Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      {/* Toolbar / Filters Skeleton */}
      <div className="p-4 rounded-2xl border border-border/70 bg-card space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <Skeleton className="h-10 rounded-xl md:col-span-5" />
          <Skeleton className="h-10 rounded-xl md:col-span-2" />
          <Skeleton className="h-10 rounded-xl md:col-span-2" />
          <Skeleton className="h-10 rounded-xl md:col-span-3" />
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
