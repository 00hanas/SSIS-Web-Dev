"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function PageSkeleton() {
  return (
    <div className="container w-full justify-center px-6">
      <Skeleton className="mb-2 h-10 w-50 rounded-md" />
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-10 w-64 rounded-md" />
        <Skeleton className="h-10 w-36 rounded-md" />
        <div className="ml-auto">
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>

      <Skeleton className="mb-2 h-[600px] w-full rounded-xl" />
      <Skeleton className="ml-auto h-10 w-50 rounded-md" />
    </div>
  )
}
