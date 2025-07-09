'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export const useNotifications = () => {
  const socketRef = useRef<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);

  const connectSocket = useCallback(() => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_WS_URL;
      
      if (!baseUrl) {
        throw new Error('NEXT_PUBLIC_WS_URL is not defined');
      }
      
      console.log('Connecting to Socket.IO:', baseUrl);
      
      // Create Socket.IO connection with options
      const socket = io(baseUrl, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
         timeout: 20000,
        forceNew: true
      });

      socketRef.current = socket;

      // Connection event handlers
      socket.on('connect', () => {
        console.log('Socket.IO connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket.IO disconnected:', reason);
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        setIsConnected(false);
      });

      // Listen for notification events
      socket.on('new_notification', (data) => {
        try {
          const newNotification: Notification = {
            id: data.id || Date.now().toString(),
            message: data.message || 'New notification',
            type: data.type || 'info',
            timestamp: new Date(data.timestamp || Date.now()),
            read: false
          };

          setNotifications(prev => [newNotification, ...prev]);
        } catch (error) {
          console.error('Error processing notification:', error);
        }
      });

      // Listen for bulk notifications (if needed)
      socket.on('new_notification', (data) => {
        try {
          const newNotifications: Notification[] = data.map((item: any) => ({
            id: item.id || Date.now().toString(),
            message: item.message || 'New notification',
            type: item.type || 'info',
            timestamp: new Date(item.timestamp || Date.now()),
            read: false
          }));

          setNotifications(prev => [...newNotifications, ...prev]);
        } catch (error) {
          console.error('Error processing bulk notifications:', error);
        }
      });

      // Handle reconnection events
      socket.on('reconnect', (attemptNumber) => {
        console.log('Socket.IO reconnected after', attemptNumber, 'attempts');
        setIsConnected(true);
        reconnectAttempts.current = 0;
      });

      socket.on('reconnect_attempt', (attemptNumber) => {
        console.log('Socket.IO reconnection attempt:', attemptNumber);
        reconnectAttempts.current = attemptNumber;
      });

      socket.on('reconnect_error', (error) => {
        console.error('Socket.IO reconnection error:', error);
      });

      socket.on('reconnect_failed', () => {
        console.error('Socket.IO reconnection failed');
        setIsConnected(false);
      });

    } catch (error) {
      console.error('Failed to connect Socket.IO:', error);
      setIsConnected(false);
    }
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    connectSocket();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connectSocket]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );

    // Optionally emit to server that notification was read
    if (socketRef.current?.connected) {
      socketRef.current.emit('notification_read', { id });
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );

    // Optionally emit to server that all notifications were read
    if (socketRef.current?.connected) {
      socketRef.current.emit('notifications_read_all');
    }
  }, []);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );

    // Optionally emit to server that notification was removed
    if (socketRef.current?.connected) {
      socketRef.current.emit('notification_removed', { id });
    }
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);

    // Optionally emit to server that all notifications were cleared
    if (socketRef.current?.connected) {
      socketRef.current.emit('notifications_cleared');
    }
  }, []);

  // Manually reconnect (if needed)
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    connectSocket();
  }, [connectSocket]);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    reconnect
  };
};