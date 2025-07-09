"use client"

import type React from "react"

import { Bell } from "lucide-react"
import type { Notification } from "@/hooks/useNotifications"
import { NotificationCard } from "./NotificationCard"

interface NotificationListProps {
    notifications: Notification[]
    onMarkAsRead: (id: string) => void
}

export const NotificationList: React.FC<NotificationListProps> = ({ notifications, onMarkAsRead }) => {
    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Bell className="h-12 w-12 mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-sm text-center max-w-sm">
                    {"You're all caught up! New notifications will appear here when they arrive."}
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {notifications.map((notification, index) => (
                <div key={notification.id} className={index === notifications.length - 1 ? "" : "border-b border-gray-100"}>
                    <NotificationCard
                        notification={notification}
                        onMarkAsRead={onMarkAsRead}
                        showActions={true}
                    />
                </div>
            ))}
        </div>
    )
}
