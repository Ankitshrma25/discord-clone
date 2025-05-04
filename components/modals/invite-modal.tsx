// components/modals/invite-modal.tsx
// This is to invite people


"use client";


import { Copy, RefreshCw } from "lucide-react";

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
import { useOrigin } from "@/hooks/use-origin";


export const InviteModal = () => {

    // Modal that has the useModal hook which is use for data centralization
    const { isOpen, onClose, type, data } = useModal(); 
    // Hook that provies the current url
    const origin = useOrigin();  
  

    // This is for opening the modal for creating a server
    const isModalOpen = isOpen && type === "invite";
    // Extract the server from the data
    const { server } = data;


    // constant to store the invite url
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
   

    
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
          <Label
            className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-secondary/70"
          >
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input 
              className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <Button
          variant="link"
          size="sm"
            className="text-xs text-zinc-500 mt-4"
          >
            Generate a new link
            <RefreshCw className="h-4 w-4 ml-2" />
          </Button>
         </div>
        </DialogContent>
      </Dialog>
    </>
    )
}