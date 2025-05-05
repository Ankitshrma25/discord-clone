// This is the initial modal
// .components/modals/initial-modal.tsx

"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
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

//schema for form
const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "Server Image is required."
    }),
});

// This is the initial modal
export const InitialModal = () => {
     // State to track if the component is mounted
    const [isMounted, setIsMounted] = useState(false);

    // useRouter hook to navigate after form submission
    const router = useRouter(); 


    useEffect(() => {
        setIsMounted(true);
    }, []);

    // This is form value and validation from react-hook-form and zod
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        },
    });

    // This is loading state for the form
    const isloading = form.formState.isSubmitting;

    // This is the function to handle form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Make a POST request to create a server
            await axios.post("/api/servers", values); 

            // Reset the form after submission
            form.reset();
            // Refresh the page after successful submission
            router.refresh(); 
            // Reload the page to reflect the changes
            window.location.reload(); 

        } catch (error) {
            // Handle the error
            console.log("Error creating server:", error);
        }
    }

    if (!isMounted){ 
        return null;
     } 

    return (
        <>
        <Dialog open>
          <DialogContent
            className="overflow-hidden bg-white p-0 text-black"
            aria-describedby="Initial Modal for new users"
          >
            <DialogHeader className="px-6 pt-8">
              <DialogTitle className="text-center text-2xl font-bold">
                Create your first server
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
                            {...field} // I will Check this later Ankit
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