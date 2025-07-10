import { Skeleton } from "@/components/ui/skeleton"
import { Send } from "lucide-react"

export function ChatSidebarLoader() {
    return (
        <div className="flex h-full bg-gray-50">
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                    <div className="flex text-nowrap items-center gap-2 text-sm text-gray-500"><Skeleton className="h-3 w-3" /> contacts</div>
                </div>
                <div className="space-y-4">
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
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Send className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-500">Choose a contact from the sidebar to start chatting</p>
                </div>
            </div>
        </div>
    )
}
