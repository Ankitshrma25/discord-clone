// components/server/server-section.tsx
// This is the server section which contains the server name, icon and dropdown menu

"use client";

import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
    Channel, 
    ChannleType, 
    MemberRole, 
    Server 
} from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "@/components/action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";


interface ServerChannelProps {
    channel: Channel;
    server: Server;
    role?: MemberRole;
}

const iconMap = {
    [ChannleType.TEXT]: (
        <Hash className="size-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
      ),
    [ChannleType.AUDIO]: (
        <Mic className="size-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
      ),
    [ChannleType.VIDEO]: (
        <Video className="size-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
      ),
};

export const ServerChannel = ({
    channel,
    server,
    role
}: ServerChannelProps) => {
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();

    // Mapping of channel types to icons
  const icon = iconMap[channel.type];

  // Onclick function to navigate to the channel page
  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  };


  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    //open the model
    onOpen(action, { channel, server });
  };

    return (
       <>
       <button 
        onClick={onClick}
        className={cn(
            "group px-2 py-2 rounded-md flex items-center text-xs gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
            params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
        )}
       >
        {icon}
        <p className={cn(
            "line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
            params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"  
        )}>
            {channel.name}
        </p>
        {channel.name !== "general" && role !== MemberRole.GUEST && (
            <div className="ml-auto flex items-center gap-x-2">
                <ActionTooltip side="top" align="center" label="Edit">
                    <Edit 
                    onClick={(e) => onAction(e, "editChannel")}
                    className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    />
                </ActionTooltip>
                <ActionTooltip side="top" align="center" label="Delete">
                    <Trash
                    onClick={(e) => onAction(e, "deleteChannel")}
                    className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                    />
                </ActionTooltip>
            </div>
        )}
        {channel.name === "general" && (
            <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        )}
       </button>
       </>
    )
}