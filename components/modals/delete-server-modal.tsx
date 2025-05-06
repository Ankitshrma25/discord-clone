// components/modals/delete-server-modal.tsx
// This modal is used to leave the server


"use client";



import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"


import { useModal } from "@/hooks/use-modal-store";

import { Button } from "@/components/ui/button";
import axios from "axios";



export const DeleteServerModal = () => {

    // Modal hook that has the useModal hook which is use for data centralization
    const { isOpen, onClose, type, data } = useModal();
    // Navigation Hook
    const router = useRouter();

    // This is for opening the modal for creating a server
    const isModalOpen = isOpen && type === "deleteServer";
    // Extract the server from the data
    const { server } = data;

    const [isLoading, SetIsLoading] = useState(false);

    const onConfirm = async () => {
        try {
            SetIsLoading(true);
            
            await axios.delete(`/api/servers/${server?.id}/`);

            onClose();
            router.refresh();
            router.push("/");
        } catch (error) {
          console.error("Error leaving server:", error);
        } finally {
            SetIsLoading(false);
        }
    }


    return (
<>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent   
          className="overflow-hidden bg-white p-0 text-black"
          aria-describedby="Create your first server"
        >
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Delete Server
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Are you sure you want to do this?<br />
              <span className="font-semibold text-indigo-500">{server?.name}</span> will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
         <DialogFooter className="bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-between w-full">
                <Button 
                disabled={isLoading} 
                onClick={onClose} 
                variant="ghost"
                className="w-[48%] bg-gray-400/50 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                    Cancel
                </Button>
                <Button 
                disabled={isLoading} 
                onClick={onConfirm} 
                variant="primary"
                className="w-[48%] bg-rose-500 hover:bg-rose-600"
                >
                    Confirm
                </Button>
            </div>
         </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
    )
}