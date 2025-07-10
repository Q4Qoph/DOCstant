"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import axios from "axios"
import { io, type Socket } from "socket.io-client"
import api from "@/lib/axios"
import { useAuth } from "@/contexts/AuthContext"

export interface Notification {
  id: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
}

export const useNotifications = () => {
  const { user } = useAuth()
  const socketRef = useRef<Socket | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await api.get(`/api/notification/my-notifications/${user?.id}`, {
      })

      const fetchedNotifications: Notification[] = response.data.map((item: any) => ({
        id: item.id,
        message: item.message,
        type: item.type || "info",
        timestamp: new Date(item.timestamp || item.createdAt),
        read: item.read || false,
      }))

      setNotifications(fetchedNotifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Failed to fetch notifications")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      await api.put(
        `/api/notifications/${id}/mark-read`,
        {},
      )

      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await api.put(
        "/api/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await axios.delete(`/api/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }, [])

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    try {
      await axios.delete("/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      setNotifications([])
    } catch (error) {
      console.error("Error clearing all notifications:", error)
    }
  }, [])

  const connectSocket = useCallback(() => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_WS_URL
      if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_WS_URL is not defined")
      }

      console.log("Connecting to Socket.IO:", baseUrl)
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
        console.log("Socket.IO connected")
        setIsConnected(true)
        reconnectAttempts.current = 0
      })

      socket.on("disconnect", (reason) => {
        console.log("Socket.IO disconnected:", reason)
        setIsConnected(false)
      })

      socket.on("connect_error", (error) => {
        console.error("Socket.IO connection error:", error)
        setIsConnected(false)
      })

      // Listen for new notification events and APPEND to existing notifications
      socket.on("new_notification", (data) => {
        try {
          const newNotification: Notification = {
            id: data.id || Date.now().toString(),
            message: data.message || "New notification",
            type: data.type || "info",
            timestamp: new Date(data.timestamp || Date.now()),
            read: false,
          }

          // Append new notification to the beginning of the list
          setNotifications((prev) => [newNotification, ...prev])
        } catch (error) {
          console.error("Error processing notification:", error)
        }
      })

      // Handle reconnection events
      socket.on("reconnect", (attemptNumber) => {
        console.log("Socket.IO reconnected after", attemptNumber, "attempts")
        setIsConnected(true)
        reconnectAttempts.current = 0
      })

      socket.on("reconnect_attempt", (attemptNumber) => {
        console.log("Socket.IO reconnection attempt:", attemptNumber)
        reconnectAttempts.current = attemptNumber
      })

      socket.on("reconnect_error", (error) => {
        console.error("Socket.IO reconnection error:", error)
      })

      socket.on("reconnect_failed", () => {
        console.error("Socket.IO reconnection failed")
        setIsConnected(false)
      })
    } catch (error) {
      console.error("Failed to connect Socket.IO:", error)
      setIsConnected(false)
    }
  }, [])

  // Initialize: Fetch notifications and connect socket
  useEffect(() => {
    fetchNotifications()
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
  }, [fetchNotifications, connectSocket])

  const sendNotification = useCallback(
    (data: {
      userId: string
      title: string
      message: string
      fromUserId: string
      toUserId: string
      fromDepartment: string
      toDepartment: string
    }) => {
      if (socketRef.current && socketRef.current.connected) {
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

  // Refresh notifications manually
  const refreshNotifications = useCallback(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Get unread count
  const unreadCount = notifications.filter((n) => !n.read).length

  return {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    reconnect,
    sendNotification,
    refreshNotifications,
    socket: socketRef.current
  }
}
