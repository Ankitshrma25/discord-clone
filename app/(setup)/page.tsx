// Organizational folder
// This is Root file
// Main page of the app

import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { InitialModal } from "@/components/modals/initial-modal";


const SetupPage = async () => {
    const profile = await initialProfile();

    if (!profile) {
        return redirect("/sign-in");
    }

    // Finding any server is this profile is memeber of
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    // If there is no server asscoiated with this profile then create a new one
    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return <InitialModal />
}
 
export default SetupPage;