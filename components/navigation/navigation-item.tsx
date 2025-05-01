"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip }  from "@/components/action-tooltip";


interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string;
};

export const NavigationItem = ({
    id,
    imageUrl,
    name
}: NavigationItemProps) => {
    const params = useParams(); // Params Hook to get the current URL parameters

    const router = useRouter(); // Navigation Router Hook to handle navigation


    return (
        <ActionTooltip
           side="right"
           align="center"
           label={name} 
        >
          <button
            className="group relative flex items-center"
            onClick={() => {
                
            }}
          >
            <div className={cn(
                "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                params?.serverId !== id && "group-hover:h-[20px]", // this checks if server id is clicked and if not it will show the hover effect
                params?.serverId === id ? "h-[36px]" : "h-[8px]"
            )} />
            <div className={cn(
                "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
            )}>
                <Image 
                 fill
                 priority
                 src={imageUrl} // Server image URL
                 alt="Channel"
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />


            </div>
          
          </button>
        </ActionTooltip>
    );
};