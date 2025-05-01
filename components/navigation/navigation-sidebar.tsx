import { redirect } from "next/navigation"; 


import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile"; 
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/db";
 
import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import { Fragment } from "react";


export const NavigationSidebar = async () => {
    const profile = await currentProfile(); // Fetch the current profile


    if (!profile) {
        return redirect("/sign-in"); // Redirect to sign-in page if no profile is found
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id, // Filter servers by the current profile ID
                },
            },
        },
    }); // Fetch all servers associated with the profile

    console.log('Servers:', servers); // Log the fetched servers for debugging
    return (
       <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
        <NavigationAction /> {/* Render the navigation action component */}
        <Separator 
            className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
        /> {/* Separator for visual separation */}
        <ScrollArea className="flex-1 w-full">
            {servers.map((server) => (
                <Fragment key={server.id}> {/* Added key prop for Fragment */}
                <div className="mb-4">
                    <NavigationItem 
                        id={server.id} // Pass the server ID to the navigation item
                        imageUrl={server.imageUrl} // Pass the server image URL to the navigation item
                        name={server.name} // Pass the server name to the navigation item
                        />
                </div>
                </Fragment>
            ))}
        </ScrollArea>
       </div>
    );
}