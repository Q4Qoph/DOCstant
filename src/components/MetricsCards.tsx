"use client"

import type React from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Stethoscope, CalendarCheck, Wallet } from "lucide-react"
import api from "@/lib/axios" // Using your provided axios instance
import { useAuth } from "@/contexts/AuthContext"

// Define a generic fetcher function using axios
const fetchMetric = async (url: string, companyId: any) => {
  const response = await api.get(url, {params: {companyId}})
  return response.data
}

interface MetricCardProps {
  title: string
  queryKey: string[]
  apiUrl: string
  icon: React.ElementType
  formatter?: (value: any) => string
}

const MetricCard: React.FC<MetricCardProps> = ({ title, queryKey, apiUrl, icon: Icon, formatter }) => {
  const {user} = useAuth()
  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () => fetchMetric(apiUrl, user?.companyId),
  })

  const displayValue = () => {
    if (data === undefined || data === null) return "N/A"
    return formatter ? formatter(data) : data.toString()
  }

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="bg-blue-50 p-2 rounded-lg">

        <Icon className="w-6 h-6 text-blue-500 " />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Skeleton loading state
          <div className="space-y-2">
            <div className="h-7 w-3/4 bg-gray-200 rounded animate-pulse" />
            {/* Optional: a smaller line for a potential sub-text or error area */}
            <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : (
          // Actual content
          <>
            <div className="text-2xl font-bold">{displayValue()}</div>
            {isError && <p className="text-xs text-red-500">{error?.message}</p>}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function MetricsCards() {
  const metrics = [
    {
      title: "Daily Payment",
      queryKey: ["dailyPayment"],
      apiUrl: "/api/Metrics/dailyPayment",
      icon: DollarSign,
      formatter: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: "Weekly Payment",
      queryKey: ["weeklyPayment"],
      apiUrl: "/api/Metrics/weeklyPayment",
      icon: DollarSign,
      formatter: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: "Monthly Payment",
      queryKey: ["monthlyPayment"],
      apiUrl: "/api/Metrics/monthlyPayment",
      icon: DollarSign,
      formatter: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: "Total Users",
      queryKey: ["userCount"],
      apiUrl: "/api/Metrics/userCount",
      icon: Users,
      formatter: (data: { role: string; count: number }[]) => {
        const total = data.reduce((sum, item) => sum + item.count, 0)
        return total.toString()
      },
    },
    {
      title: "Total Patients",
      queryKey: ["patients"],
      apiUrl: "/api/Metrics/patients",
      icon: Stethoscope,
    },
    {
      title: "Re-evaluations",
      queryKey: ["reevaluation"],
      apiUrl: "/api/Metrics/reevaluation",
      icon: CalendarCheck,
    },
    {
      title: "Period Payment",
      queryKey: ["periodPayment"],
      apiUrl: "/api/Metrics/periodPayment",
      icon: Wallet,
      formatter: (value: number) => `$${value.toFixed(2)}`,
    },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.queryKey[0]} {...metric} />
      ))}
    </div>
  )
}
