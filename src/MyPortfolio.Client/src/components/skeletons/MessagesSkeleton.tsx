import { Skeleton } from "@/components/ui/skeleton";

export default function MessagesSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32 rounded-md" />
        <Skeleton className="h-9 w-56 rounded-md" />
      </div>
      <div className="border rounded-xl overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 border-b last:border-none"
          >
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-3 w-16 rounded-md" />
                </div>

                <Skeleton className="h-3 w-48 rounded-md" />

                <Skeleton className="h-3 w-40 rounded-md" />

                <div className="border-t my-2" />
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-3 w-5/6 rounded-md" />
                    <Skeleton className="h-3 w-2/3 rounded-md" />
                    
                    <div className="flex justify-end pt-2">
                        <Skeleton className="w-8 h-8 rounded-md" />
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