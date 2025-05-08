// app/api/channels/[channelId]/route.ts
// This is the route.ts for deleting a channel

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request, 
    { params }: { params: { channelId: string } }
) {
   try {
       // Get current profile
       const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

       // Check if profile exists
       if (!profile) {
           return new NextResponse("Unauthorized", { status: 401 });
       }

       //Check if serverId is provided
       if (!serverId) {
           return new NextResponse("Server ID missing", { status: 400 });
       }
       //Check if channelId is provided
       if (!params.channelId) {
           return new NextResponse("Channel ID missing", { status: 400 });
       }
       // Update the server
       const server = await db.server.update({
           where: {
               id: serverId,
               members: {
                   some: {
                       profileId: profile.id,
                       role: {
                           in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                       }
                   }
               }
           },
           data: {
               channels: {
                   delete: {
                       id: params.channelId,
                       name: {
                           not: "General"
                       }
                   }
               }
           }
       });

       return NextResponse.json(server);
   } catch (error) {
       console.log("[CHANNEL_ID_DELETE]", error);
       return new NextResponse("Internal Error", { status: 500 });
   } 
}  

export async function PATCH(
    req: Request, 
    { params }: { params: { channelId: string } }
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

       //Check if serverId is provided
       if (!serverId) {
           return new NextResponse("Server ID missing", { status: 400 });
       }
       //Check if channelId is provided
       if (!params.channelId) {
           return new NextResponse("Channel ID missing", { status: 400 });
       }

       if (name === "General") {
           return new NextResponse("Name cannot be 'General'", { status: 400 });
       }

       // Update the server
       const server = await db.server.update({
           where: {
               id: serverId,
               members: {
                   some: {
                       profileId: profile.id,
                       role: {
                           in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                       }
                   }
               }
           },
           data: {
               channels: {
                   update: {
                       where: {
                           id: params.channelId,
                           NOT: {
                               name: "General"
                           },
                       },
                       data: {
                           name: name,
                           type: type,
                       }
                   }
               }
           }
       });

       return NextResponse.json(server);
   } catch (error) {
       console.log("[CHANNEL_ID_PATCH]", error);
       return new NextResponse("Internal Error", { status: 500 });
   } 
}  