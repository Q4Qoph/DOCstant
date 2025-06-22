import { Skeleton } from "@/components/ui/skeleton";

export default function UserManagementSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-xl border bg-white shadow-sm space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-10" />
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 w-full sm:w-1/2" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Table Headers */}
      <div className="hidden sm:grid grid-cols-6 gap-4 text-sm text-muted-foreground">
        <div>User</div>
        <div>Role</div>
        <div className="col-span-2">Contact</div>
        <div className="col-span-2">Actions</div>
      </div>

      {/* User Rows */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-6 gap-4 items-center bg-white p-4 rounded-xl shadow-sm"
          >
            {/* User Info */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>

            {/* Role */}
            <Skeleton className="h-8 w-24 rounded-md" />

            {/* Contact */}
            <div className="col-span-2 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-40" />
            </div>

            {/* Actions */}
            <div className="col-span-2 flex justify-end gap-2">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
