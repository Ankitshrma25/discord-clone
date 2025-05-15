// app/api/channels/route.ts
// this route is for creating a channel in a server
import { NextResponse } from "next/server";
import { MemberRole } from "@/lib/generated/prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(
    req: Request
) {
    try {
        // Get current profile
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

        // Check if profile exists
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        //checking serverId
        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }

        // avoiding the user to bypass the frontend validation and manage to send the api request to enter in the general channel
        if (name === "general") {
            return new NextResponse("Name cannot be 'general'", { status: 400 });
        }

        // Updating the server in the database with the provided name and imageUrl
        
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role:{
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type
                    }
                }
            }
        })

        return NextResponse.json(server); // Return the created server as a JSON response
    } catch (error) {
        console.log("[CHANNELS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}