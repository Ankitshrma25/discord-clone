// app/api/servers/route.ts
import { v4 as uuidv4 } from "uuid"; // Import the uuid library to generate unique IDs for the server
import { NextResponse } from "next/server";
import { MemberRole } from "@/lib/generated/prisma/client";


import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json(); // Parse the request body to get the name and imageUrl
        const profile = await currentProfile(); // Get the current profile of the user

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 }); // Return a 401 status code if the user is not authenticated
        }
        // Create a new server in the database with the provided name and imageUrl
        const server = await db.server.create({
            data: {
                profileId: profile.id, // Associate the server with the current user's profile
                name,
                imageUrl,
                inviteCode: uuidv4(), // Generate a unique invite code for the server
                channels: {
                    create: [
                        { name: "general", profileId: profile.id }, // Create a default channel named "general" for the server by the profile owner
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN } // Add the profile owner as a member of the server
                    ]
                }
            }
        });

        return NextResponse.json(server); // Return the created server as a JSON response


    }  catch (error) {
        console.log("[SERVERS_POST]", error); // Log the error for debugging
        return new NextResponse("Internal Error", { status: 500 }); // Return a 500 status code for internal server error
    }
}