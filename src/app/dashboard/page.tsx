"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, Settings, UserPlus, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import MetricsCards from "@/components/MetricsCards"
import UserRolesBreakdownCard from "@/components/UserRolesBreakdownCard"

const Dashboard = () => {
  const { user } = useAuth()
  const quickActions = [
    { title: "Register Patient", icon: UserPlus, color: "bg-blue-500", href: "/dashboard/patients" },
    { title: "Admitted Patients", icon: FileText, color: "bg-purple-500", href: "/dashboard/admitted-patients" },
    { title: "Prescriptions", icon: Pill, color: "bg-orange-500", href: "/dashboard/prescriptions" },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name || "User"}! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/patients">
              <Button size="sm" className="bg-blue-500">
                <Plus className="h-4 w-4 mr-2" />
                New Patient
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Frequently used hospital management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link href={action.href} key={index}>
                    <Button variant="ghost" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-50">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-center">{action.title}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent activity</p>
                    <Button variant="link" size="sm" className="mt-1">
                      View all activities
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Key Metrics
            </CardTitle>
            <CardDescription>Overview of hospital operational data</CardDescription>
          </CardHeader>
          <CardContent>
            <MetricsCards />
          </CardContent>
        </Card>
        {/* User Roles Breakdown */}
        <UserRolesBreakdownCard /> {/* New component for user roles */}
        {/* Bottom Action Bar */}
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-semibold text-gray-900">Need help getting started?</h3>
              <p className="text-sm text-gray-600">Check out our documentation and tutorials</p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/docs">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentation
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
