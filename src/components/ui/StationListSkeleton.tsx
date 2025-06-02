
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface StationListSkeletonProps {
  count?: number;
}

export function StationListSkeleton({ count = 6 }: StationListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Skeleton className="h-5 w-5 mt-1 rounded-full" />
              <div className="w-full space-y-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-4 w-1/2" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="relative">
      <Skeleton className="h-[500px] w-full rounded-lg" />
      <div className="absolute top-4 left-4 space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="absolute top-4 right-4">
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}
