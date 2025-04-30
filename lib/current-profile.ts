import { auth } from "@clerk/nextjs/server";


import { db } from "@/lib/db";

export const currentProfile = async () => {
    const { userId } = await auth(); // To check if the user is authenticated

    if (!userId) {
        return null; // Return null if the user is not authenticated
    }

    const profile = await db.profile.findUnique({

        where: {
            userId: userId },
    });

    return profile; // Return the profile if found
}