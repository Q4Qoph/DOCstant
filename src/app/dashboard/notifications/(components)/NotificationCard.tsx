"use client"

import type React from "react"
import { Check, Trash2, Bell, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface Notification {
    id: string
    title: string
    message: string
    timestamp: Date
    read: boolean
    toUserId: string
    type?: "info" | "success" | "warning" | "error"
}

interface NotificationCardProps {
    notification: Notification
    onMarkAsRead: (id: string, userId: string) => void
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

    const getNotificationVariant = () => {
        if (!notification.read) return "default"
        return "secondary"
    }

    return (
        <TooltipProvider>
            <Card
                className={cn(
                    "shadow-none",
                    onClick && "cursor-pointer",
                    !notification.read && "bg-gradient-to-r from-blue-50/80 to-transparent border-l-4 border-l-blue-500",
                )}
                onClick={onClick}
            >
                <div className="px-5">
                    <div className="flex items-start gap-3">
                        {/* Notification Avatar */}
                        <Avatar className={cn("h-8 w-8 transition-colors")}>
                            <AvatarFallback className={cn("border-0 text-yellow-600 bg-yellow-100")}>
                                <Bell className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <h4
                                        className={cn(
                                            "text-sm font-medium leading-tight",
                                            !notification.read ? "text-foreground" : "text-muted-foreground",
                                        )}
                                    >
                                        {notification.title}
                                    </h4>
                                    {!notification.read && (
                                        <Badge variant={getNotificationVariant()} className="h-5 px-1.5 text-xs">
                                            New
                                        </Badge>
                                    )}
                                </div>

                                {/* Actions */}
                                {showActions && (
                                    <div
                                        className={cn(
                                            "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                                            !notification.read && "opacity-100",
                                        )}
                                    >
                                        {!notification.read && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onMarkAsRead(notification.id, notification.toUserId)
                                                        }}
                                                        className={cn(
                                                            "h-8 w-8 p-0 rounded-full",
                                                            "hover:bg-green-100 hover:text-green-700",
                                                            "focus:bg-green-100 focus:text-green-700",
                                                            "transition-colors duration-200",
                                                        )}
                                                    >
                                                        <Check className="h-3.5 w-3.5" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Mark as read</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

                                        {onDelete && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onDelete(notification.id)
                                                        }}
                                                        className={cn(
                                                            "h-8 w-8 p-0 rounded-full",
                                                            "hover:bg-red-100 hover:text-red-700",
                                                            "focus:bg-red-100 focus:text-red-700",
                                                            "transition-colors duration-200",
                                                        )}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete notification</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </div>
                                )}
                            </div>

                            <p
                                className={cn(
                                    "text-sm leading-relaxed",
                                    !notification.read ? "text-foreground/80" : "text-muted-foreground",
                                )}
                            >
                                {notification.message}
                            </p>

                            <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                                <Clock className="h-3 w-3" />
                                <span className="font-medium">{formatTime(notification.timestamp)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </TooltipProvider>
    )
}
