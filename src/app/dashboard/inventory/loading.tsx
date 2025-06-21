import { Skeleton } from "@/components/ui/skeleton"
import InventoryTableSkeleton from "./(components)/InventoryTableSkeleton"

export default function InventoryPageSkeleton() {
    return (
        <div className="space-y-6 px-6 py-8">
            {/* Page Header */}
            <div className="space-y-1">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
            </div>

            {/* Card Header with Button */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-20 rounded-md" />
            </div>

            {/* Search Input */}
            <div className="flex items-center space-x-2 max-w-sm">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Table Skeleton */}
            <InventoryTableSkeleton />
        </div>
    )
}
