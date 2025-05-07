import { Channel, Server, ChannleType } from "@/lib/generated/prisma/client";

import { create } from "zustand";

export type ModalType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer" | "deleteChannel";



interface ModalData {
    server?: Server;
    channel?: Channel;
    channelType?: ChannleType;
    apiUrl?: string;
    query?: Record<string, any>;
}

interface ModalStore {
   type: ModalType | null;
   data: ModalData;
   isOpen: boolean;
   onOpen: (type: ModalType , data?: ModalData) => void;
   onClose: () => void;
}


export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type: ModalType, data: ModalData = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false, type: null }),
}));
