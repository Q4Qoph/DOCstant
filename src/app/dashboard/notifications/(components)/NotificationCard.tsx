"use client"

import type React from "react"

import { Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Notification } from "@/hooks/useNotifications"

interface NotificationCardProps {
    notification: Notification
    onMarkAsRead: (id: string) => void
    onDelete?: (id: string) => void
    onClick?: () => void
    showActions?: boolean
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
    notification,
    onMarkAsRead,
    onDelete,
    onClick,
    showActions = true,
}) => {
    const getNotificationIcon = (type: Notification["type"]) => {
        switch (type) {
            case "success":
                return <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            case "error":
                return <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            case "warning":
                return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            default:
                return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        }
    }

    const formatTime = (timestamp: Date) => {
        const now = new Date()
        const diff = now.getTime() - timestamp.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (days > 0) return `${days}d ago`
        if (hours > 0) return `${hours}h ago`
        if (minutes > 0) return `${minutes}m ago`
        return "Just now"
    }

    return (
        <div
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${onClick ? "cursor-pointer" : ""
                } ${!notification.read ? "bg-blue-50" : ""}`}
            onClick={onClick}
        >
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.read ? "font-medium text-gray-900" : "text-gray-700"}`}>
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatTime(notification.timestamp)}</p>
                </div>
                {showActions && (
                    <div className="flex items-center space-x-1">
                        {!notification.read && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onMarkAsRead(notification.id)
                                }}
                                className="h-6 w-6 p-0"
                                title="Mark as read"
                            >
                                <Check className="h-3 w-3" />
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete(notification.id)
                                }}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                title="Delete notification"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
