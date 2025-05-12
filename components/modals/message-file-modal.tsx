// components/modals/message-file-modal.tsx


"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import qs from "query-string";


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
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

//schema for form
const formSchema = z.object({
  
    fileUrl: z.string().min(1, {
        message: "Attachement is required."
    }),
});

// This is the initial modal
export const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();

    // useRouter hook to navigate after form submission
    const router = useRouter();

    // This is for opening the modal for creating a server
    const isModalOpen = isOpen && type === "messageFile";
    //distruction the apiUrl from data
    const { apiUrl, query } = data;

    // This is form value and validation from react-hook-form and zod
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        },
    });

    const handleClose = () => {
        form.reset();
        onClose();
    }

    // This is loading state for the form
    const isloading = form.formState.isSubmitting;

    // This is the function to handle form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            //generate the url
            const url = qs.stringifyUrl({
              url: apiUrl || "",
              query,
            });
            // Make a POST request to create a server
            await axios.post(url, {
              ...values,
              content: values.fileUrl,
            }); 

            // Reset the form after submission
            form.reset();
            // Refresh the page after successful submission
            router.refresh(); 
            handleClose();

        } catch (error) {
            // Handle the error
            console.log("Error creating server:", error);
        }
    }

    return (
        <>
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
          <DialogContent
            className="overflow-hidden bg-white p-0 text-black"
            aria-describedby="Initial Modal for new users"
          >
            <DialogHeader className="px-6 pt-8">
              <DialogTitle className="text-center text-2xl font-bold">
                Add an attachment
              </DialogTitle>
              <DialogDescription className="text-center text-zinc-500">
                Send a file as a message
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-8 px-6">
                  <div className="flex items-center justify-center text-center">
                    <FormField
                      control={form.control}
                      name="fileUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUpload
                              endpoint="messageFile"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>                
                </div>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                  <Button
                    disabled={isloading}
                    variant={"primary"}
                    className="w-full"
                  >
                    Send
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </>
    )
}