"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function PageSkeleton() {
  return (
    <div className="container w-full justify-center px-6">
      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <div className="container mt-5 mb-2 flex flex-col space-y-2">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-5 w-64 rounded-md" />
      </div>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-10 w-64 rounded-md" />
        <Skeleton className="h-10 w-36 rounded-md" />
        <div className="ml-auto">
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>
      <div className="container">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    </div>
  )
}
