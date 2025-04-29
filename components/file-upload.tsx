"use client";

import { Url } from "next/dist/shared/lib/router/router";
import { UploadDropzone } from "@/lib/uploadthing";


import "@uploadthing/react/styles.css";
import { error } from "console";

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
