import { Skeleton } from "@/components/ui/skeleton";

export default function PinnedProjectsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-40 rounded-md" />
        <Skeleton className="h-8 w-44 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="p-4 border border-[#d0d7de] bg-card/70 dark:border-[#30363d] dark:bg-slate-800/70 rounded-md space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
              <Skeleton className="h-4 w-24 rounded-full" />
            </div>

            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-5/6 rounded-md" />

            <div className="flex gap-2 flex-wrap">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>

            <div className="flex gap-4">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}