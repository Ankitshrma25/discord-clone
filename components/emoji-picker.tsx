//components/emoji-picker.tsx
"use client";

import React, { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Smile } from "lucide-react";
import EmojiPickerReact, { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";


interface EmojiPickerProps {
    onChange: (value: string) => void;
}

export const EmojiPicker = ({
    onChange,
}: EmojiPickerProps) => {
    const [open, setOpen] = useState(false);
    const { resolvedTheme } = useTheme();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button type="button">
                <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
                </button>
            </PopoverTrigger>

            <PopoverContent side="right" sideOffset={40}
                className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
            >
                <EmojiPickerReact
                    onEmojiClick={(emojiData) => {
                        onChange(emojiData.emoji);
                        setOpen(false);
                    }}
                    theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
                    lazyLoadEmojis
                />
            </PopoverContent>
        </Popover>
    )
}