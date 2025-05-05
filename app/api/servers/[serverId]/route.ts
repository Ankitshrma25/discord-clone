// app/api/servers/[serverId]/route.ts

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export async function PATCH(
    req:Request, 
    { params }: { params: { serverId: string } }
) {
    try{
        // Get current profile
        const profile = await currentProfile();
        const { name, imageUrl } = await req.json();

        // Check if profile exists
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        //Update server
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl,
            }
        });

        return NextResponse.json(server);
        } catch (error) {
        console.log("[SERVER_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });

    } 
}