// components/modals/edit-channel-modal.tsx
// This modal is used to edit channels in the server


"use client";

import qs from "query-string";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChannleType } from "@prisma/client";
import axios from "axios";


import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import  { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect } from "react";





//schema for form for creating channels
const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required."
    }).refine(
        name => name !== "general",
        {
            message: "Channel name cannot be 'general' already exists",
        }
    ),
    type: z.nativeEnum(ChannleType, {
      message: "Channel type is required",
    }),
});

export const EditChannelModal = () => {

    // Modal Store for opening and closing the modal
    const { isOpen, onClose, type, data } = useModal();   
    // useRouter hook to navigate
    const router = useRouter(); 

    //Params Hook
    const params = useParams();
   

    // This is for opening the modal for creating a server
    const isModalOpen = isOpen && type === "editChannel";

    const { channel, server } = data;
   

    // Form validation from zod
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channel?.type || ChannleType.TEXT,
        },
    });

    useEffect(() => {
        if (channel) {
            form.setValue("name", channel.name);
            form.setValue("type", channel.type);
        }
    }, [form, channel]);

    // Loading state for the form
    const isloading = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
          const url = qs.stringifyUrl({
            url: `/api/channels/${channel?.id}`,
            query: {
              serverId: server?.id,
            },
          });
            await axios.patch(url, data); // patch request to create a server

            form.reset(); // Optionally, you can close the modal or perform any other action after successful submission
            router.refresh(); // Refresh the page to reflect the new server
            onClose(); // Close the modal after successful submission
        } catch (error) {
            console.log("Error creating server:", error);
        }
    }

    // Fuction to handle closing the modal
    const handleClose = () => {
        form.reset();
        onClose();
    }

    
    return (
<>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent
         
          className="overflow-hidden bg-white p-0 text-black"
          aria-describedby="Create your first server"
        >
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Edit Channel
            </DialogTitle>
            
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 px-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-secondary/70 text-xs font-bold text-zinc-500 uppercase">
                        Channel Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Channel name"
                          disabled={isloading}
                          className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-300/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* second form field */}
                <FormField 
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                    className="dark:text-secondary/70 text-xs font-bold text-zinc-500 uppercase"
                    >
                      Channel Type
                    </FormLabel>
                    <Select
                      disabled={isloading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                     <FormControl>
                      <SelectTrigger 
                      className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                      >
                        <SelectValue placeholder="Select a channel type" />
                      </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannleType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                     
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
                />
              </div>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button
                  disabled={isloading}
                  variant={"primary"}
                  className="w-full"
                >
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
    )
}
