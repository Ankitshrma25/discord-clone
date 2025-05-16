"use client";

import qs from "query-string";
import { Video, VideoOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ActionTooltip } from "@/components/action-tooltip";  

export const ChatVideoButton = () => {
    const pathName = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const isVideo = searchParams?.get("video");

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathName || "",
            query: {
                video: isVideo ? undefined : true,
            }
        }, { skipNull: true });
        router.push(url);
    }

    const Icon = isVideo ? VideoOff : Video;
    const tooltipLabel = isVideo ? "End video call" : "Start video call";
    return ( 
        <ActionTooltip label={tooltipLabel}>
            <button onClick={onClick} className="hover:opacity-75 transition mr-4">
                <Icon className="text-zinc-500 h-6 w-6 dark:text-zinc-400" />
            </button>
        </ActionTooltip>
    )
}