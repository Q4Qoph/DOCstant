"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import axios from "axios"
import { io, type Socket } from "socket.io-client"
import api from "@/lib/axios"
import { useAuth } from "@/contexts/AuthContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export interface Notification {
  id: string
  title: string
  message: string
  toUserId: string
  timestamp: Date
  read: boolean
}

export const useNotifications = () => {
  const { user } = useAuth()
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)

  const queryClient = useQueryClient()

  const {
    data: notifications = [],
    isLoading,
    error,
    refetch: refreshNotifications,
  } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const res = await api.get(`/api/notification/my-notifications/${user?.id}`)
      return res.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        message: item.message,
        toUserId: item.toUserId,
        timestamp: new Date(item.createdAt),
        read: item.isRead || false,
      }))
    },
    enabled: !!user?.id,
  })

  const {
    data: unreadCount = 0,
  } = useQuery({
    queryKey: ["unread-count", user?.id],
    queryFn: async () => {
      const res = await api.get(`/api/notification/unread-count/${user?.id}`)
      return res.data.unreadCount
    },
    enabled: !!user?.id,
  })

  // Mark as read
  const markAsReadMutation = useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      await api.put(`/api/notification/${id}/mark-read`, null, {
        params: { userId },
      });
      return { id, userId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] })
      queryClient.invalidateQueries({ queryKey: ["unread-count", user?.id] })
    },
  })

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await api.put("/api/notifications/read-all", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] })
      queryClient.invalidateQueries({ queryKey: ["unread-count", user?.id] })
    },
  })

  // Delete a notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] })
    },
  })

  // Clear all
  const clearAllMutation = useMutation({
    mutationFn: async () => {
      await axios.delete("/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] })
      queryClient.invalidateQueries({ queryKey: ["unread-count", user?.id] })
    },
  })


  const connectSocket = useCallback(() => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_WS_URL
      if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_WS_URL is not defined")
      }

      console.log("Connecting to Socket.IO...")

      const socket = io(baseUrl, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: true
      });

      socketRef.current = socket

      // Connection event handlers
      socket.on("connect", () => {
        setIsConnected(true)
        reconnectAttempts.current = 0
      })

      socket.on("disconnect", (reason) => {
        setIsConnected(false)
      })

      socket.on("connect_error", (error) => {
        setIsConnected(false)
      })

      // Listen for new notification events 
      socket.on("new_notification", (data) => {
        const newNotification: Notification = {
          id: data.id || Date.now().toString(),
          title: data.title,
          message: data.message,
          toUserId: data.toUserId,
          timestamp: new Date(data.createdAt),
          read: false,
        }
        queryClient.setQueryData<Notification[]>(["notifications", user?.id], (old = []) => [newNotification, ...old])
        queryClient.invalidateQueries({ queryKey: ["unread-count", user?.id] })
      })

      // Handle reconnection events
      socket.on("reconnect", (attemptNumber) => {
        console.log("Socket.IO reconnected after", attemptNumber, "attempts")
        setIsConnected(true)
        reconnectAttempts.current = 0
      })

      socket.on("reconnect_attempt", (attemptNumber) => {
        reconnectAttempts.current = attemptNumber
      })

      socket.on("reconnect_error", (error) => {
        console.error("Socket.IO reconnection error:", error)
      })

      socket.on("reconnect_failed", () => {
        setIsConnected(false)
      })
    } catch (error) {
      setIsConnected(false)
    }
  }, [])

  // Initialize: Fetch notifications and connect socket
  useEffect(() => {
    connectSocket()

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [connectSocket])

  const sendNotification = useCallback(
    (data: {
      title: string
      message: string
      fromUserId: string
      toUserIds: string[]
      fromDepartment: number
      toDepartment: number
    }) => {
      if (socketRef.current && socketRef.current.connected) {
        console.log(data)
        socketRef.current.emit("notify", data)
      } else {
        console.warn("Socket not connected. Notification not sent.")
      }
    },
    [],
  )

  // Manually reconnect (if needed)
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
    }
    connectSocket()
  }, [connectSocket])


  return {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    error,
    markAsRead: (id: string, userId: string) =>
      markAsReadMutation.mutate({ id, userId }),
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    clearAllNotifications: clearAllMutation.mutate,
    reconnect,
    sendNotification,
    refreshNotifications,
    socket: socketRef.current,
  }

}
