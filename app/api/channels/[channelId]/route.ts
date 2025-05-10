// app/api/channels/[channelId]/route.ts
// This is the route.ts for deleting a channel

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request, 
    { params }: { params: Promise<{ channelId: string }> }
) {
   try {
       // Get current profile
       const profile = await currentProfile();
       // parse the request URL to get the search parameters
        const { searchParams } = new URL(req.url);
        // Get the serverId from the search parameters
        const serverId = searchParams.get("serverId");

       // Check if profile exists
       if (!profile) {
           return new NextResponse("Unauthorized", { status: 401 });
       }

       //Check if serverId is provided
       if (!serverId) {
           return new NextResponse("Server ID missing", { status: 400 });
       }

       // get the channel Id from the request parameters
       const { channelId } = await params;
       //Check if channelId is provided
       
       if (!channelId) {
           return new NextResponse("Channel ID missing", { status: 400 });
       }
       // Delete the channel from the database
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
                       id: channelId,
                       name: {
                           not: "General"
                       },
                   },
               },
           },
       });

       // Return the updated server
       return NextResponse.json(server);
   } catch (error) {
       console.log("[CHANNEL_ID_DELETE]", error);
       return new NextResponse("Internal Error", { status: 500 });
   } 
}  

export async function PATCH(
    req: Request, 
    { params }: { params: Promise<{ channelId: string }> }
) {
   try {
       // Get current profile
       const profile = await currentProfile();

       // Destructure name and type from the request body
       const { name, type } = await req.json();
       // Parse the request URL to get the search parameters
        const { searchParams } = new URL(req.url);
        // Get the serverId from the search parameters
        const serverId = searchParams.get("serverId");

       // Check if profile exists
       if (!profile) {
           return new NextResponse("Unauthorized", { status: 401 });
       }

       //Check if serverId is provided
       if (!serverId) {
           return new NextResponse("Server ID missing", { status: 400 });
       }

       // get the channel Id from the request parameters
       const { channelId } = await params;
       //Check if channelId is provided
       if (!channelId) {
           return new NextResponse("Channel ID missing", { status: 400 });
       }

       if (name === "General") {
           return new NextResponse("Name cannot be 'General'", { status: 400 });
       }

       // Delete the channel from the database
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
                           id: channelId,
                           NOT: {
                               name: "General"
                           },
                       },
                       data: {
                           name,
                           type,
                       }
                   }
               }
           }
       });

       // Return the updated server
       return NextResponse.json(server);
   } catch (error) {
    console.log("Eror hai bhaiya idhr");
       console.log("[CHANNEL_ID_PATCH]", error);
       return new NextResponse("Internal Error", { status: 500 });
   } 
}  