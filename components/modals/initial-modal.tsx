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
    })
})

export const InitialModal = () => {

    const [isMounted, setIsMounted] = useState(false); // State to track if the component is mounted

    const router = useRouter(); // useRouter hook to navigate after form submission


    useEffect(() => {
        setIsMounted(true);
    }, []);


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });


    const isloading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/servers", values); // Send the form data to the server


            form.reset();
            // Optionally, you can close the modal or perform any other action after successful submission
            router.refresh(); // Refresh the page to reflect the new server
            window.location.reload(); // Reload the page to reflect the new server

        } catch (error) {
            console.log("Error creating server:", error);
        }
    }

    if (!isMounted){ 
        return null;
     } 

    return (
       <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden top-0 left-0 translate-x-[-50%] translate-y-[-50%] sm:max-w-lg sm:w-full">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Customize your server</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and an image. You can always change it later.
                    </DialogDescription>
                </DialogHeader>
            
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} 
                    className="space-y-8">
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
                                    </FormItem>
                                )}
                                 />
                            </div>

                            <FormField 
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-sm font-bold text-zinc-500
                                        dark:text-secondary/70">
                                            Server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                            disabled={isloading}
                                            placeholder="Enter a Server name"
                                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black
                                            focus-visible:ring-offset-0"
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />  
                                    </FormItem>

                                )}
                            />

                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                    <Button variant="primary" disabled={isloading} >Get Started</Button>
                </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
       </Dialog>
    )
}