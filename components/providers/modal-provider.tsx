// components/providers/modal-provider.tsx
//Modal Provider is used to centrally manage and render modal components

"use client";

import { useEffect, useState } from "react";

import { EditServerModal } from "@/components/modals/edit-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { CreateServerModal } from "@/components/modals/create-server-modal";


export const ModalProvider = () => {
    
    // used to avoid hydration errors
    const [isMounted, setIsMounted] = useState(false);
 

    useEffect(() => {
        setIsMounted(true);
    }, []);
    // used to avoid hydration errors
    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
        </>
    )
}