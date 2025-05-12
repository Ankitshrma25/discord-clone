//lib/current-profile-pages.ts

import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";


export const currentProfilePages = async (req: NextApiRequest) => {
    const { userId } = await getAuth(req); // To check if the user is authenticated

    if (!userId) {
        return null; // Return null if the user is not authenticated
    }

    const profile = await db.profile.findUnique({

        where: {
            userId: userId },
    });

    return profile; // Return the profile if found
}