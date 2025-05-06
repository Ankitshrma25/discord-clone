//components/server/server-header.tsx
// This is the server header which contains the dropdown menu
"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { ChevronDown, LogOut, Settings, Trash, UserCircle, UserPlus, Users } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";


interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole;
};

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
    // importing the useModal hook for the data of the modal
    const { onOpen } = useModal();

    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="focus:outline-none"
                asChild
            >
                <button
                    className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
                >
                    {server.name}
                    <ChevronDown className="w-5 h-5 ml-auto" />

                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top">
                <div className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
                    {isModerator && (
                        <DropdownMenuItem
                        onClick={() => onOpen("invite", { server })}
                            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                        >
                            Invite People
                            <UserPlus className="w-4 h-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                    {isAdmin && (
                        <DropdownMenuItem
                        onClick={() => onOpen("editServer", { server })}
                            className="px-3 py-2 text-sm cursor-pointer"
                        >
                            Server Settings
                            <Settings className="w-4 h-4 ml-auto" />
                        </DropdownMenuItem>

                    )}
                    {isAdmin && (
                        <DropdownMenuItem
                        onClick={() => onOpen("members", { server })}
                            className="px-3 py-2 text-sm cursor-pointer"
                        >
                            Manage Members
                            <Users className="w-4 h-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                    {isModerator && (
                        <DropdownMenuItem
                            onClick={() => onOpen("createChannel", { server })}
                            className="px-3 py-2 text-sm cursor-pointer"
                        >
                            Create Channel
                            <UserCircle className="w-4 h-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                </div>
                {isModerator && (
                    <DropdownMenuSeparator />
                )}
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen("deleteServer", { server })}
                        className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                    >
                        Delete Server
                        <Trash className="w-4 h-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("leaveServer", { server })}
                        className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                    >
                        Leave Server
                        <LogOut className="w-4 h-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};