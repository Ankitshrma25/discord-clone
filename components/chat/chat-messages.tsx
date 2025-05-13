//components/chat/chat-messages.tsx
"use client";


import { Fragment } from "react";

import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Message, Member, Profile } from "@/lib/generated/prisma/client";

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile;
    };
};

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
    // Make the query key for the useChatQuery hook
    const queryKey = `chat:${chatId}`

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    });
    
    // If status is pending, return a loading message
    if (status === "pending") {
        return (
            <div className="flex-1 flex justify-center items-center">
                <Loader2 className="my-4 w-7 h-7 text-zinc-500 animate-spin" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading messages...
                </p>
            </div>
        );
    }

    // If status is error, return an error message
     if (status === "error") {
        return (
            <div className="flex-1 flex justify-center items-center">
                <ServerCrash className="my-4 w-7 h-7 text-zinc-500" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Something went wrong!
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 py-4 overflow-auto">
            <div className="flex-1 px-4 sm:px-6" />
            <ChatWelcome 
                type={type}
                name={name}  
            />
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMemberWithProfile) => (
                            <div key={message.id}>
                                {message.content}
                            </div>
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}