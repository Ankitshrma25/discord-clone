// components/modals/delete-message-modal.tsx
// This modal is used to leave the server


"use client";


import qs from "query-string";
import { useState } from "react";

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



export const DeleteMessageModal = () => {

    // Modal hook that has the useModal hook which is use for data centralization
    const { isOpen, onClose, type, data } = useModal();
   
    // This is for opening the modal for creating a server
    const isModalOpen = isOpen && type === "deleteMessage";
    // Extract the server from the data
    const { apiUrl, query } = data;

    const [isLoading, SetIsLoading] = useState(false);

    const onConfirm = async () => {
        try {
            SetIsLoading(true);

            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            });
            
            await axios.delete(url);

            onClose();           
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
              Delete Message
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Are you sure you want to do this?<br />
              The message will be permanently deleted
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