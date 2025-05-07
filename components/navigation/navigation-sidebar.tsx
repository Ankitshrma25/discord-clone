import { redirect } from "next/navigation"; 
import { UserButton } from "@clerk/nextjs";


import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile"; 
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
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
        <>
        <div className="text-primary flex size-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 dark:bg-[#1E1F22]">
          <NavigationAction />
          <Separator className="mx-auto h-[2px] !w-14 rounded-md bg-zinc-300 dark:bg-zinc-700" />
          <ScrollArea className="w-full flex-1">
            {servers.map((server) => (
              <Fragment key={server.id}>
                <div className="mb-4">
                  <NavigationItem
                    id={server.id}
                    name={server.name}
                    imageUrl={server.imageUrl}
                  />
                </div>
              </Fragment>
            ))}
          </ScrollArea>
          <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
            <ModeToggle />
            <UserButton
              appearance={{
                elements: {
                  userButtonBox:
                    "size-[48px] scale-175 relative rounded-full left-[17.5px]",
                },
              }}
            />
          </div>
        </div>
      </>
    );
}