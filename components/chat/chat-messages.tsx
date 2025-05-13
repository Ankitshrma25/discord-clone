//components/chat/chat-messages.tsx
"use client";

import { Member } from "@prisma/client";

import { ChatWelcome } from "./chat-welcome";

interface ChatMessagesprops {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

export const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}: ChatMessagesprops) => {
    return (
        <div className="flex flex-col flex-1 py-4 overflow-auto">
            <div className="flex-1 px-4 sm:px-6" />
            <ChatWelcome 
                type={type}
                name={name}
                
            />
        </div>
    )
}