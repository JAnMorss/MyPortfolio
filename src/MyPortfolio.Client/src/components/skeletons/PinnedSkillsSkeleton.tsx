import { Skeleton } from "@/components/ui/skeleton";

export default function PinnedSkillsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-40 rounded-md" />
        <Skeleton className="h-8 w-44 rounded-md" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-[#d0d7de] bg-card/70 dark:border-[#30363d] dark:bg-slate-800/70 space-y-3"
          >
            <Skeleton className="h-4 w-24 rounded-md" />

            <div className="w-full h-2 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
              <Skeleton className="h-2 w-3/4 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}