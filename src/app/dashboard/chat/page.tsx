"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { ChatSidebar } from "./(components)/ChatSidebar"
import { ChatArea } from "./(components)/ChatArea"
import { useNotifications } from "@/hooks/useNotifications"
import api from "@/lib/axios"

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

export default function ChatPage() {
  const { user } = useAuth()
  const { socket, isConnected } = useNotifications()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await api.get("/api/user/users")
      setUsers(res.data)
    } catch (err) {
      console.error("Failed to fetch users", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load chat history
  const loadChat = useCallback(() => {
    if (user?.id && selectedUser && socket) {
      socket.emit("load_chat", {
        userA: user.id,
        userB: selectedUser.id,
      })
    }
  }, [user?.id, selectedUser, socket])

  // Handle user selection
  const handleUserSelect = useCallback((u: User) => {
    setSelectedUser(u)
  }, [])

  // Send message
  const handleSendMessage = useCallback(
    (content: string) => {
      if (!user || !selectedUser || !socket) return

      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        receiverId: selectedUser.id,
        content,
        timestamp: new Date(),
        senderName: "You",
      }

      // Emit to server
      socket.emit("chat_message", {
        senderId: user.id,
        receiverId: selectedUser.id,
        content,
      })

      // Optimistically add to UI
      setMessages((prev) => [...prev, newMessage])
    },
    [user, selectedUser, socket],
  )

  // Setup socket listeners
  useEffect(() => {
    if (!user?.id || !socket) return

    socket.emit("register", user.id)

    const handleReceiveMessage = (data: { senderId: string; message: string }) => {
      if (!selectedUser) return
      if (data.senderId !== selectedUser.id) return

      const msg: Message = {
        id: Date.now().toString(),
        senderId: data.senderId,
        receiverId: user.id,
        content: data.message,
        timestamp: new Date(),
        senderName: selectedUser.name,
      }

      setMessages((prev) => [...prev, msg])
    }

    const handleChatHistory = (records: any[]) => {
      const formatted: Message[] = records.map((msg) => ({
        id: `${msg.SenderId}-${msg.ReceiverId}-${Date.now()}-${Math.random()}`,
        senderId: msg.SenderId,
        receiverId: msg.ReceiverId,
        content: msg.Content,
        timestamp: new Date(msg.CreatedAt),
        senderName: msg.SenderId === user.id ? "You" : selectedUser?.name || "User",
      }))
      setMessages(formatted)
    }

    socket.on("receive_message", handleReceiveMessage)
    socket.on("chat_history", handleChatHistory)

    return () => {
      socket.off("receive_message", handleReceiveMessage)
      socket.off("chat_history", handleChatHistory)
    }
  }, [user?.id, socket, selectedUser])

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
      fetchUsers()
    }
  }, [user?.id, fetchUsers])

  // Load chat on user select
  useEffect(() => {
    if (selectedUser) {
      loadChat()
    }
  }, [selectedUser, loadChat])

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Please log in to access chat</p>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-gray-50">
      <ChatSidebar
        users={users}
        selectedUser={selectedUser}
        onUserSelect={handleUserSelect}
        isLoading={isLoading}
      />
      <ChatArea
        selectedUser={selectedUser}
        messages={messages}
        currentUserId={user.id}
        onSendMessage={handleSendMessage}
        isConnected={isConnected}
      />
    </div>
  )
}
