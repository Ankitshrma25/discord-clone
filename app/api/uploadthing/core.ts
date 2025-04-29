import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
    try {
      // Check if the user is authenticated
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");
        //return the user ID to be used in the uploading process
        return { userId: userId };
    } catch (error) {
        throw new Error("Authorization failed");
    }
};

// FileRouter for your app
export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    messageFile: f(["image", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
