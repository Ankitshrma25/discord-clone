"use client";
import { X } from "lucide-react";
import Image from "next/image";


import { UploadDropzone } from "@/lib/uploadthing";





interface FileUploadProps {
    onChange: (Url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({
    onChange,
    value,
    endpoint
}: FileUploadProps) => {
   
    // const fileType = value ? value.split(".").pop() : null;
    const fileType = value?.split(".").pop();

    if (value && fileType !== "pdf") {
        return (
            <div className="relative h-20 w-20">
                <Image 
                    fill
                    src={value}
                    alt="Upload"
                    className="rounded-full"
                />
                <button
                onClick={() => {
                    onChange("");
                }}
                className="bg-rose-500 text-white rounded-full absolute top-0 right-0 shadow-sm"
                type="button"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    return (
        <UploadDropzone 
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
               onChange(res?.[0].ufsUrl); 
            }}
            onUploadError={(error: Error) => {
                console.error("Upload error:", error);
            }}
        />
    )
}
