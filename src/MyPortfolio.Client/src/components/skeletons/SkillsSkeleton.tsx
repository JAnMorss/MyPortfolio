import { Skeleton } from "@/components/ui/skeleton";

export default function SkillsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-between items-center border-b pb-3">
        <Skeleton className="h-9 w-64 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
      <div className="divide-y">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="py-4 flex justify-between items-center px-2"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>

              <Skeleton className="h-3 w-48 rounded-md" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-8 h-8 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-md" />
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