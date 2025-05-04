// components/server/server-sidebar.tsx

import { ChannleType } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";

interface ServerSidebarProps {
    serverId: string;
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
            </div>
        </>
    )
};