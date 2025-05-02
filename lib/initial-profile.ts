// lib/initialProfile.ts

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

// Fuction to fetch the initial profile for the current user
// If the user is not authenticated, redirect to the sign-in page
export const initialProfile = async () => {

    // Get the current user
    const user = await currentUser();

    // If the user is not authenticated, redirect to the sign-in page
    if (!user) {
        return redirect("/sign-in");
    }

    // Check if the user already has a profile in db
    const profile = await db.profile.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (profile) {
        return profile;
    }

    // If the user doesn't have a profile, create one
    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
        },
    });

    // Return the new profile
    if (newProfile) {
        return newProfile;
    }

    return null;
}