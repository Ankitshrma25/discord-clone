//components/chat/chat-messages.tsx
"use client";


import { Fragment, useRef } from "react";

import { format } from "date-fns";

import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Message, Member, Profile } from "@/lib/generated/prisma/client";
import { ChatItem } from "./chat-item";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

const DATE_FORMAT = "d MMM yyyy, HH:mm";


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
    // Make the add and update keys for the useChatSocket hook
    const addKey = `chat:${chatId}:messages`
    // Make the add and update keys for the useChatSocket hook
    const updateKey = `chat:${chatId}:messages:update`

    // Make a ref for the chat container
    const chatRef = useRef<HTMLDivElement>(null);

    // Make a ref for the chat container
    const bottomRef = useRef<HTMLDivElement>(null);

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

    // Use the useChatSocket hook
    useChatSocket({ queryKey, addKey, updateKey});
    
     // Use the useChatScroll hook
  useChatScroll({
    chatRef,
    bottomRef,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
    loadMore: fetchNextPage,
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
        <div ref={chatRef} className="flex flex-col flex-1 py-4 overflow-auto">
           {!hasNextPage && <div className="flex-1 px-4 sm:px-6" />}
            {!hasNextPage && (
                <ChatWelcome 
                type={type}
                name={name}  
            />
            )}
            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage ? (
                        <Loader2 className="my-4 w-6 h-6 text-zinc-500 animate-spin" />
                    ) : (
                        <button
                            onClick={() => fetchNextPage()}
                            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
                        >
                            Load previous messages
                        </button>
                    )}
                </div>
            )}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMemberWithProfile) => (
                            <ChatItem 
                                key={message.id}
                                id={message.id}
                                currentMember={member}
                                member={message.member}
                                content={message.content}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                isUpdated={message.updatedAt !== message.createdAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
            <div ref={bottomRef} />
        </div>
    )
}