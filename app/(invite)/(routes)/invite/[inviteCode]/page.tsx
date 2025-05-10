// app/(invite)/(routes)/invite/[inviteCode]/page.tsx
// this is the invite code page.. it just invite people and redirects them to the server

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";


interface InviteCodePageProps {
    params: Promise<{
        inviteCode: string,

     }>
}

const InviteCodePage = async ({
    params
}: InviteCodePageProps) => {

    // fatch the profile
    const profile = await currentProfile();

    const { inviteCode } = await params;

    if (!profile) {
        return <RedirectToSignIn />
    }

    if (!inviteCode) {
        return redirect("/");
    }

    // checking if the person is already the part of the server
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: inviteCode,
            members: {
                some: {
                    profileId: profile.id,
                }
            }
        }
    });

    // if existing server, redirect to the server
    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    const server = await db.server.update({
        where: {
            inviteCode: inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    }
                ]
            }
        }
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }


    return null;
}

export default InviteCodePage;