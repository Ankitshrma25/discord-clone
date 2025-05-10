// components/chat/chat-header.tsx


import { Hash } from "lucide-react";

export const ChatHeader = () => {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Chat</h1>
            <Hash className="w-4 h-4" />
        </div>
    )
}