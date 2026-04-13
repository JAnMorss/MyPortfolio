import { Skeleton } from "@/components/ui/skeleton";

export default function ContactSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="p-4 border border-[#d0d7de] bg-card/70 dark:border-[#30363d] dark:bg-slate-800/70 rounded-md flex items-start gap-3">
        <Skeleton className="w-5 h-5 rounded-md mt-0.5" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-3 w-72 rounded-md" />
        </div>
      </div>

      <div className="p-6 border border-[#d0d7de] bg-card/70 dark:border-[#30363d] dark:bg-slate-800/70 rounded-md space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-32 w-full rounded-md" />
        </div>

        <Skeleton className="h-10 w-40 rounded-md" />
      </div>
    </div>
  );
}