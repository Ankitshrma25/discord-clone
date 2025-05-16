//app/(main)/(routes)/servers/[serverId]/channels/[channelId]/page.tsx

import { currentProfile } from "@/lib/current-profile";

import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { channel } from "diagnostics_channel";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChannleType } from "@/lib/generated/prisma/client";
import { MediaRoom } from "@/components/media-room";

interface ChannelIdPageProps {
    params: Promise<{
        serverId: string,
        channelId: string,
    }>
}

const ChannelIdPage = async ({
    params,
}: ChannelIdPageProps) => {

    //fatching current profile
    const profile = await currentProfile();

    //if no profile, redirect to sign in
    if (!profile) {
        return redirect("/");
    }

    // fetching the server id from params
    const { channelId, serverId } = await params;

    // fatching the channels from db
    const channel = await db.channel.findUnique({
        where: {
            id: channelId,
        },
    });

    // fatching the memeber from db
    const member = await db.member.findFirst({
        where: {
            serverId: serverId,
            profileId: profile.id
        },
        include: {
            profile: true,
        }
    });

    // In case there is no channel or member
    if (!channel || !member) {
        return redirect("/");
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />
            {channel.type === ChannleType.TEXT && (
                <>
                    <ChatMessages
                        member={member}
                        name={channel.name}
                        type="channel"
                        chatId={channel.id}
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />
                    <ChatInput
                        name={channel.name}
                        type="channel"
                        apiUrl="/api/socket/messages"
                        query={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                    />
                </>
            )}
            {channel.type === ChannleType.AUDIO && (
               <MediaRoom 
                chatId={channel.id}
                video={false}
                audio={true}
               /> 
            )}

            {channel.type === ChannleType.VIDEO && (
               <MediaRoom 
                chatId={channel.id}
                video={true}
                audio={true}
               /> 
            )}
        </div>
    );
}

export default ChannelIdPage;