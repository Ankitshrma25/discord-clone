//app/(main)/(routes)/servers/[serverId]/layout.tsx

import { RedirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ServerSidebar } from "@/components/server/server-sidebar";

const ServerIdLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ serverId: string }>;
}) => {
    // await the params to get the serverId
    const { serverId } = await params;

    // fetch the current profile
    const profile = await currentProfile();

    // if no profile, redirect to sign in
    if (!profile) {
        return <RedirectToSignIn />;
    }


    // creating servers for this profile
    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    //
    if (!server) {
        return redirect("/");
    }


    return (

        <div className="h-full">
            {/* Gona render servers associated with the current profile */}
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
            
            <ServerSidebar serverId={serverId} />
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    );
}

export default ServerIdLayout;