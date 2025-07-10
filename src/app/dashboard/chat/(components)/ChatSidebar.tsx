"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface User {
    id: string
    name: string
    isOnline?: boolean
}

interface ChatSidebarProps {
    users: User[]
    selectedUser: User | null
    onUserSelect: (user: User) => void
    isLoading?: boolean
}

export function ChatSidebar({ users, selectedUser, onUserSelect, isLoading = false }: ChatSidebarProps) {
    const getInitials = (name: string) => {
        return `${name.charAt(0)}`.toUpperCase()
    }

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                <p className="flex text-nowrap items-center text-sm text-gray-500">{isLoading ? <Skeleton className="h-3 w-3" /> : `${users.length} `}contacts</p>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2">
                    {isLoading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                                        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => onUserSelect(user)}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50",
                                    selectedUser?.id === user.id && "bg-blue-50 border border-blue-200",
                                )}
                            >
                                <div className="relative">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-gray-100 text-gray-600">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {user.isOnline && (
                                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p
                                            className={cn(
                                                "text-sm font-medium truncate",
                                                selectedUser?.id === user.id ? "text-blue-900" : "text-gray-900",
                                            )}
                                        >
                                            {user.name}
                                        </p>
                                        {user.isOnline && (
                                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                                Online
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user.isOnline ? "Active now" : "Last seen recently"}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
