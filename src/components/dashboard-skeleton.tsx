import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Users, CheckCircle2 } from 'lucide-react';

export function DashboardSkeleton() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <PlusCircle className="h-6 w-6 text-muted" />
            <Skeleton className="h-7 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-32 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-muted" />
            <Skeleton className="h-7 w-48" />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-32 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-muted" />
                <Skeleton className="h-7 w-40" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4 p-4 rounded-lg border">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-full mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
