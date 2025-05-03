// components/modals/create-server-modal.tsx
// This is the create server modal


"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import axios from "axios";


import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

//schema for form
const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "Server Image is required."
    })
})

export const CreateServerModal = () => {

    // Modal Store for opening and closing the modal
    const { isOpen, onClose, type } = useModal();   
    // useRouter hook to navigate
    const router = useRouter(); 

    // This is for opening the modal for creating a server
    const isModalOpen = isOpen && type === "createServer";
   

    // Form validation from zod
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        },
    });

    // Loading state for the form
    const isloading = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const apiData = await axios.post("/api/servers", data); // Post request to create a server

            form.reset(); // Optionally, you can close the modal or perform any other action after successful submission
            
            onClose(); // Close the modal after successful submission
            
            router.push(`/servers/${apiData.data.id}`); // Redirect to the channel page with the server name
            
            router.refresh(); // Refresh the page to reflect the new server
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
              Create your server
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Give your server a personality with a name and an image. You can
              always change it later.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 px-6">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-secondary/70 text-xs font-bold text-zinc-500 uppercase">
                        Server Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter server name"
                          {...field}
                          disabled={isloading}
                          className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-300/50"
                          {...field}
                        />
                      </FormControl>
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
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
    )
}