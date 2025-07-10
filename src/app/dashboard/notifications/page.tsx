"use client"

import { useState } from "react"
import { Bell, CheckCheck, Trash2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNotifications } from "@/hooks/useNotifications"
import { NotificationList } from "./(components)/NotificationList"

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
  } = useNotifications()

  const filteredNotifications = notifications.filter((notification: any) => {
    if (filter === "unread") return !notification.read
    if (filter === "read") return notification.read
    return true
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-1">Stay updated with your latest activities</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
              <span>{isConnected ? "Connected" : "Disconnected"}</span>
            </div>
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              {notifications.length} total
            </Badge>
            {unreadCount > 0 && <Badge className="text-sm">{unreadCount} unread</Badge>}
          </div>

          <div className="flex items-center space-x-2">
            {/* Filter */}
            <Select value={filter} onValueChange={(value: "all" | "unread" | "read") => setFilter(value)}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>

            {/* Actions */}
            {/* {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="flex items-center space-x-2 bg-transparent"
              >
                <CheckCheck className="h-4 w-4" />
                <span>Mark all read</span>
              </Button>
            )} */}

            {/* {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear all</span>
              </Button>
            )} */}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <NotificationList 
      notifications={filteredNotifications} onMarkAsRead={markAsRead} 
       />

      {/* Empty state for filtered results */}
      {filteredNotifications.length === 0 && notifications.length > 0 && (
        <div className="text-center py-12 text-gray-500">
          <Filter className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No {filter} notifications</h3>
          <p className="text-sm">Try changing the filter to see more notifications.</p>
        </div>
      )}
    </div>
  )
}
