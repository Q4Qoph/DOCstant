"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bell, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNotifications, type Notification } from "@/hooks/useNotifications"
import Link from "next/link"
import { NotificationCard } from "@/app/dashboard/notifications/(components)/NotificationCard"

interface NotificationDropdownProps {
  className?: string
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, isConnected, markAsRead } = useNotifications()

  // Show only the first 3 notifications in dropdown
  const previewNotifications = notifications.slice(0, 3)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Button */}
      <Button variant="ghost" size="sm" className="relative" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
        {/* Connection status indicator */}
        <div
          className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
        />
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                Notifications
                {unreadCount > 0 && <span className="ml-2 text-sm text-gray-500">({unreadCount} unread)</span>}
              </h3>
            </div>
          </div>

          {/* Preview Notifications */}
          <div className="max-h-64 overflow-y-auto">
            {previewNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              previewNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onClick={() => handleNotificationClick(notification)}
                  showActions={false}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            {notifications.length > 3 && (
              <Link href="/notifications" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-between text-sm">
                  View all notifications
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <p className="text-xs text-gray-500 text-center mt-2">
              Connection: {isConnected ? "Connected" : "Disconnected"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
