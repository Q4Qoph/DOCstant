"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { io, type Socket } from "socket.io-client"
import api from "@/lib/axios"
import { useAuth } from "@/contexts/AuthContext"
import { ChatSidebar } from "./(components)/ChatSidebar"
import { ChatArea } from "./(components)/ChatArea"

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
  const socketRef = useRef<Socket | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Connect to socket
  const connectSocket = useCallback(() => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_WS_URL
      if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_WS_URL is not defined")
      }

      console.log("Connecting to Socket.IO for chat:", baseUrl)
      const socket = io(baseUrl, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: true,
      })

      socketRef.current = socket

      // Connection event handlers
      socket.on("connect", () => {
        console.log("Chat Socket.IO connected")
        setIsConnected(true)
        // Join user's room for receiving messages
        if (user?.id) {
          socket.emit("join_user_room", user.id)
        }
      })

      socket.on("disconnect", (reason) => {
        console.log("Chat Socket.IO disconnected:", reason)
        setIsConnected(false)
      })

      socket.on("connect_error", (error) => {
        console.error("Chat Socket.IO connection error:", error)
        setIsConnected(false)
      })

      // Listen for new messages
      socket.on("new_message", (messageData) => {
        try {
          const newMessage: Message = {
            id: messageData.id || Date.now().toString(),
            senderId: messageData.senderId,
            receiverId: messageData.receiverId,
            content: messageData.content,
            timestamp: new Date(messageData.timestamp || Date.now()),
            senderName: messageData.senderName || "User",
          }

          // Only add message if it's for the current conversation
          if (
            (newMessage.senderId === selectedUser?.id && newMessage.receiverId === user?.id) ||
            (newMessage.senderId === user?.id && newMessage.receiverId === selectedUser?.id)
          ) {
            setMessages((prev) => [...prev, newMessage])
          }
        } catch (error) {
          console.error("Error processing message:", error)
        }
      })

      // Listen for user online status updates
      socket.on("user_online", (userId: string) => {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isOnline: true } : u)))
      })

      socket.on("user_offline", (userId: string) => {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isOnline: false } : u)))
      })
    } catch (error) {
      console.error("Failed to connect Socket.IO:", error)
      setIsConnected(false)
    }
  }, [user?.id, selectedUser?.id])

  // Fetch users from database
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/api/user/users")
      setUsers(response.data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
      // Mock data fallback
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch messages for selected user
  const fetchMessages = useCallback(
    async (userId: string) => {
      try {
        const response = await api.get(`/api/messages/${userId}`)
        setMessages(response.data)
      } catch (error) {
        console.error("Failed to fetch messages:", error)
        // Mock data fallback
        setMessages([
          {
            id: "1",
            senderId: user?.id || "current-user",
            receiverId: userId,
            content: "Hey there! How are you doing?",
            timestamp: new Date(Date.now() - 3600000),
            senderName: "You",
          },
          {
            id: "2",
            senderId: userId,
            receiverId: user?.id || "current-user",
            content: "Hi! I'm doing great, thanks for asking!",
            timestamp: new Date(Date.now() - 3000000),
            senderName: users.find((u) => u.id === userId)?.name || "User",
          },
        ])
      }
    },
    [user?.id, users],
  )

  // Handle user selection
  const handleUserSelect = useCallback(
    (selectedUser: User) => {
      setSelectedUser(selectedUser)
      fetchMessages(selectedUser.id)
    },
    [fetchMessages],
  )

  // Send message via socket
  const handleSendMessage = useCallback(
    (content: string) => {
      if (!selectedUser || !socketRef.current || !user?.id) return

      const messageData = {
        id: Date.now().toString(),
        senderId: user.id,
        receiverId: selectedUser.id,
        content,
        timestamp: new Date(),
        senderName: `${user.name}` || "You",
      }

      // Emit message through socket
      socketRef.current.emit("send_message", messageData)

      // Add message to local state immediately
      const newMessage: Message = {
        ...messageData,
        senderName: "You",
      }
      setMessages((prev) => [...prev, newMessage])

      // Optionally save to database via API
      api.post("/api/messages", messageData).catch((error) => {
        console.error("Failed to save message to database:", error)
      })
    },
    [selectedUser, user],
  )

  // Initialize
  useEffect(() => {
    if (user?.id) {
      fetchUsers()
      connectSocket()
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [user?.id, fetchUsers, connectSocket])

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Please log in to access chat</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
       users={users} 
       selectedUser={selectedUser} 
       onUserSelect={handleUserSelect}
        isLoading={isLoading} />
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
