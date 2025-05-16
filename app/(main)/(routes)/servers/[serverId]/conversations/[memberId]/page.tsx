//app/(main)/(routes)/servers/[serverId]/conversations/[memberId]/page.tsx
// this is the member id page which holds the conversation page

import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatHeader } from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";

import { db } from "@/lib/db";

import { redirect } from "next/navigation";
import { MediaRoom } from "@/components/media-room";

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    };
    searchParams: { video?: boolean | null | undefined };
}

const MemberIdPage = async ({
    params,
    searchParams,
}: MemberIdPageProps) => {
    // Fatched the current profile
    const profile = await currentProfile();
    // If no profile is found, redirect to the sign-in page
    if (!profile) {
        return redirect("/");
    }

    // fetching server id from params
    const { memberId, serverId } = params;

    // finding current memeber
    const currentMember = await db.member.findFirst({
        where: {
            serverId: serverId,
            profileId: profile.id,
        },
        include: {
            profile: true,
        },
    })

    if (!currentMember) {
        return redirect("/");
    }

    const conversation = await getOrCreateConversation(currentMember.id, memberId);

    // If something went wrong, redirect to the general channel
    if (!conversation) {
        return redirect(`/servers/${serverId}`);
    }
    // assigning which memeber we are.. memberOne or memberTwo
    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                imageUrl={otherMember.profile.imageUrl}
                name={otherMember.profile.name}
                serverId={serverId}
                type="conversation"
            />
            {searchParams.video && (
                <MediaRoom 
                    chatId={conversation.id}
                    video={Boolean(String(searchParams.video) === "true")}
                    audio={true}
                />
            )}

            {!searchParams.video && (
                <>
                    <ChatMessages
                        member={currentMember}
                        name={otherMember.profile.name}
                        chatId={conversation.id}
                        type="conversation"
                        apiUrl="/api/direct-messages"
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        socketUrl="/api/socket/direct-messages"
                        socketQuery={{
                            conversationId: conversation.id
                        }}
                    />
                    <ChatInput
                        name={otherMember.profile.name}
                        type="conversation"
                        apiUrl="/api/socket/direct-messages"
                        query={{
                            conversationId: conversation.id,
                        }}
                    />
                </>
            )}

        </div>
    );
}

export default MemberIdPage;