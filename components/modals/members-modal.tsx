// components/modals/members-modal.tsx
// This is to add memebers in the server


"use client";


import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"


import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import axios from "axios";


export const MembersModal = () => {

    // Modal hook that has the useModal hook which is use for data centralization
    const { onOpen,isOpen, onClose, type, data } = useModal(); 
    
  

    // This is for opening the modal for creating a server
    const isModalOpen = isOpen && type === "members";
    // Extract the server from the data
    const { server } = data;

    
    
    return (
<>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent
         
          className="overflow-hidden bg-white p-0 text-black"
          aria-describedby="Create your first server"
        >
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Invite People
            </DialogTitle>
          </DialogHeader>
         <div className="p-6">
            Hello Members
         </div>
        </DialogContent>
      </Dialog>
    </>
    )
}