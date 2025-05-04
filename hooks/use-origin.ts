//hooks/use-origin.ts
// This hook is used to read the current url to invite people to the server

import { useEffect, useState } from "react";

export const useOrigin = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // This gives the current url of the window
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

    if (!mounted) {
        return "";
    }


    return origin;
}
