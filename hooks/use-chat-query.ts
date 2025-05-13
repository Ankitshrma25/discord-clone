//hooks/use-chat-query.ts


import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
    queryKey: string;
    apiUrl: string;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
};

export const useChatQuery = ({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
}: ChatQueryProps) => {
    // Extract isConnected from socket 
    const { isConnected } = useSocket();
   

    // Fucntion to fetch our Messages
    const fetchMessages = async ({ pageParam }: { pageParam?: string | null }) => {
         // generating Url from qs
         const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam,
                [paramKey]: paramValue,
            },
         }, { skipNull: true });
         const res = await fetch(url);
         return res.json();
    
    };
    // creating Query using useInfiniteQuery
    const {
        data,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        initialPageParam: null, // initial value null or 0 or '' depending on your pagination logic
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000,
    });

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    };
};