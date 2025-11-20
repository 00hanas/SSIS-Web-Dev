import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="container w-full justify-center p-6">
      <div className="mb-5 flex flex-row gap-5">
        <div className="flex-1 flex-col space-y-5">
          <Skeleton className="h-27 w-full rounded-xl" />
          <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            <Skeleton className="h-30 w-full rounded-xl" />
            <Skeleton className="h-30 w-full rounded-xl" />
            <Skeleton className="h-30 w-full rounded-xl" />
          </div>
          <Skeleton className="h-107.5 w-full rounded-xl" />
        </div>
        <div className="ml-auto w-[300px] flex-col space-y-5">
          <div className="w-full">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
          <div className="w-full">
            <Skeleton className="h-[270px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
