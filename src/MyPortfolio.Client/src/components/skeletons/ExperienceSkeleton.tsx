import { Skeleton } from "@/components/ui/skeleton";

export default function ExperienceSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-between items-center border-b pb-3">
        <Skeleton className="h-9 w-64 rounded-md" />
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="p-4 border border-[#d0d7de] dark:border-[#30363d] rounded-md"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="w-9 h-9 rounded-md" />
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40 rounded-md" />
                    <Skeleton className="h-3 w-32 rounded-md" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="w-8 h-8 rounded-md" />
                    <Skeleton className="w-8 h-8 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-5/6 rounded-md" />
              </div>
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