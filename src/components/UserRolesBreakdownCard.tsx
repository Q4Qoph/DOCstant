"use client"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users } from "lucide-react"
import api from "@/lib/axios"
import { useAuth } from "@/contexts/AuthContext"

interface UserRole {
  role: string
  count: number
}

const fetchUserRoles = async (companyId: any): Promise<UserRole[]> => {
  const response = await api.get("/api/Metrics/userCount", { params: { companyId } })
  return response.data
}

export default function UserRolesBreakdownCard() {
  const { user } = useAuth()
  const { data, isLoading, isError, error } = useQuery<UserRole[]>({
    queryKey: ["userRoles"],
    queryFn: () => fetchUserRoles(user?.companyId),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Roles Breakdown
        </CardTitle>
        <CardDescription>Distribution of users by their assigned roles.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="text-center text-gray-500">Loading user roles...</div>}
        {isError && <div className="text-center text-red-500">Error loading user roles: {error?.message}</div>}
        {data && data.length > 0 ? (
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">{item.role}</p>
                <p className="text-sm text-gray-600 font-semibold">{item.count}</p>
              </div>
            ))}
          </div>
        ) : (
          !isLoading && !isError && <div className="text-center text-gray-500">No user role data available.</div>
        )}
      </CardContent>
    </Card>
  )
}
