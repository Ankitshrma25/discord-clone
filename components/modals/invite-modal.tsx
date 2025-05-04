// components/modals/invite-modal.tsx
// This is to invite people


"use client";



import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"


import { useModal } from "@/hooks/use-modal-store";


export const InviteModal = () => {

    // Modal Store for opening and closing the modal
    const { isOpen, onClose, type } = useModal();   
  

    // This is for opening the modal for creating a server
    const isModalOpen = isOpen && type === "invite";
   

    
    return (
<>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent
         
          className="overflow-hidden bg-white p-0 text-black"
          aria-describedby="Create your first server"
        >
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Create your server
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Give your server a personality with a name and an image. You can
              always change it later.
            </DialogDescription>
          </DialogHeader>
         Invite Modal!!
        </DialogContent>
      </Dialog>
    </>
    )
}