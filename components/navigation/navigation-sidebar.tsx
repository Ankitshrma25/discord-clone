import { redirect } from "next/navigation"; 


import { currentProfile } from "@/lib/current-profile"; 
import { db } from "@/lib/db";
 
import { NavigationAction } from "./navigation-action";


export const NavigationSidebar = async () => {
    const profile = await currentProfile(); // Fetch the current profile


    if (!profile) {
        return redirect("/"); // Redirect to sign-in page if no profile is found
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id, // Filter servers by the current profile ID
                }
            }
        }
    }); // Fetch all servers associated with the profile

    return (
       <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
        <NavigationAction /> {/* Render the navigation action component */}
       </div>
    );
}