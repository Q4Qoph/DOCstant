import { cn } from "@/lib/utils"

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  senderName: string
}

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-xs lg:max-w-md", isOwn ? "order-1" : "order-2")}>
        <div
          className={cn(
            "px-4 py-2 rounded-2xl",
            isOwn ? "bg-blue-600 text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md",
          )}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <div className={cn("mt-1 text-xs text-gray-500", isOwn ? "text-right" : "text-left")}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
}
