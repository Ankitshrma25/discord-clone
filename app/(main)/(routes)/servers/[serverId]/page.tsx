// app/(main)/(routes)/servers/[serverId]/page.tsx

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";


interface ServerIdPageProps {
    params: Promise<{
        serverId: string;
    }>;
};


const ServerIdPage = async ({
    params
}: ServerIdPageProps) => {

    // fatch the current profile
    const profile = await currentProfile();
    const { serverId } = await params;

    if (!profile) {
        return redirect("/");
    }

    // attampt to find the server
    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id,
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: "general"
                },
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    })

    const initialChannel = server?.channels[0];

    if (initialChannel?.name !== "general") {
        return null
    }

    return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`)
}

export default ServerIdPage;

