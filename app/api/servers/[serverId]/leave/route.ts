// app/api/servers/[serverId]/route.ts
// This is the route.ts for leaving a server

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request, 
    { params }: { params: { serverId: string } }
){
    try {
        // Get current profile
        const profile = await currentProfile();

        // Check if profile exists
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        //Check if serverId is provided
        if (!params.serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }

        //update the server
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: {
                    not: profile.id
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
     console.log("[SERVER_ID_PATCH]", error);
     return new NextResponse("Internal Error", { status: 500 });   
    }
}
