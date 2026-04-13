import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
        <Skeleton className="h-9 w-64 rounded-md" />

        <div className="flex gap-2">
          <Skeleton className="h-9 w-[140px] rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
      </div>

      <div className="divide-y">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="py-5 px-3 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-5 w-48 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-full" />
              </div>

              <div className="flex gap-2">
                <Skeleton className="h-8 w-28 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-3 w-2/3 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
            <div className="flex gap-2 flex-wrap">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        <Skeleton className="w-10 h-8 rounded-md" />
        <Skeleton className="w-10 h-8 rounded-md" />
        <Skeleton className="w-10 h-8 rounded-md" />
      </div>
    </div>
  );
}