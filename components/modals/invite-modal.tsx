// components/modals/invite-modal.tsx
// This is to invite people


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
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";


export const InviteModal = () => {

    // Modal hook that has the useModal hook which is use for data centralization
    const { onOpen,isOpen, onClose, type, data } = useModal(); 
    // Hook that provies the current url
    const origin = useOrigin();  
  

    // This is for opening the modal for creating a server
    const isModalOpen = isOpen && type === "invite";
    // Extract the server from the data
    const { server } = data;

    const [copied, setCopied] = useState(false);

    const [isLoading, SetIsLoading] = useState(false);


    // constant to store the invite url
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;


    // function to copy invite code
    const onCopy = () => {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
    

    // fucntion to refresh the invite code
    const onNew = async () => {
      try {
        SetIsLoading(true);
        const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
        onOpen("invite", { server: response.data });
      } catch (error) {
        console.log(error);
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
            disabled={isLoading}
              className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button disabled={isLoading} onClick={onCopy} size="icon">
              {copied 
              ? <Check className="h-4 w-4" /> 
              :  <Copy className="h-4 w-4" />
              }
             
            </Button>
          </div>
          <Button
          disabled={isLoading}
          onClick={onNew}
          variant="link"
          size="sm"
            className="mt-4 w-full cursor-pointer text-xs tracking-wider text-zinc-800"
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