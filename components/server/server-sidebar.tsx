// components/server/server-sidebar.tsx

import { ChannleType, MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ScrollArea } from "@/components/ui/scroll-area";
import { redirect } from "next/navigation";

import { ServerHeader } from "./server-header";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

interface ServerSidebarProps {
    serverId: string;
}

// component icons map function
const iconMap = {
    [ChannleType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
    [ChannleType.AUDIO]: <Mic className="w-4 h-4 mr-2" />,
    [ChannleType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
};

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
}
export const ServerSidebar = async ({
    serverId,
}: ServerSidebarProps) => {


    // fetching current profile
    const profile = await currentProfile();

    if (!profile) {
        return redirect("/");
    }

    // fetching the server
    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc",
                },
            }
        },
    });


    // seperating channels and members
    const textChannels = server?.channels.filter((channel) => channel.type === ChannleType.TEXT );
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannleType.AUDIO );
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannleType.VIDEO );

    const members = server?.members.filter((member) => member.profileId !== profile.id);

    // if no server then redirect
    if (!server) {
        return redirect("/");
    }

    // checking our role inside of the server
    const role = server.members.find((member) => member.profileId === profile.id)?.role;
    
    return (
        <>
            <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
                <ServerHeader 
                    server={server}
                    role={role}
                />
                <ScrollArea
                className="flex-1 px-3"
                >
                    <div className="mt-2">
                        <ServerSearch 
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member) => ({
                                    id: member.profileId,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role],
                                })),
                            },
                        ]}
                        />
                    </div>
                </ScrollArea>
            </div>
        </>
    )
};