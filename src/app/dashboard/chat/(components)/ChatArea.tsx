"use client"

import type React from "react"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { MessageBubble } from "./MessageBubble"

interface User {
    id: string
    name: string
    isOnline?: boolean
}

interface Message {
    id: string
    senderId: string
    receiverId: string
    content: string
    timestamp: Date
    senderName: string
}

interface ChatAreaProps {
    selectedUser: User | null
    messages: Message[]
    currentUserId: string
    onSendMessage: (content: string) => void
    isConnected?: boolean
}

export function ChatArea({ selectedUser, messages, currentUserId, onSendMessage, isConnected = false }: ChatAreaProps) {
    const [messageInput, setMessageInput] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (messageInput.trim() && selectedUser && isConnected) {
            onSendMessage(messageInput.trim())
            setMessageInput("")
        }
    }

    const getInitials = (name: string) => {
        return `${name.charAt(0)}`.toUpperCase()
    }

    if (!selectedUser) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Send className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-500">Choose a contact from the sidebar to start chatting</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {getInitials(selectedUser.name)}
                                </AvatarFallback>
                            </Avatar>
                            {selectedUser.isOnline && (
                                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">
                                {selectedUser.name}
                            </h3>
                            <p className="text-sm text-gray-500">{selectedUser.isOnline ? "Active now" : "Last seen recently"}</p>
                        </div>
                    </div>

                    {/* Connection Status */}
                    <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")} />
                        <span className="text-xs text-gray-500">{isConnected ? "Connected" : "Disconnected"}</span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} isOwn={message.senderId === currentUserId} />
                    ))}
                </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder={`Message ${selectedUser.name}...`}
                        className="flex-1"
                        disabled={!isConnected}
                    />
                    <Button
                        type="submit"
                        disabled={!messageInput.trim() || !isConnected}
                        className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
                {!isConnected && <p className="text-xs text-red-500 mt-1">Disconnected - messages cannot be sent</p>}
            </div>
        </div>
    )
}