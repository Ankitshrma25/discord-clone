//components/providers/socket-provider.tsx
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

// Hook that returns the socket context
export const useSocket = () => {
    return useContext(SocketContext);
};

//Socket provider
export const SocketProvider = ({ 
    children 
}: {
    children: React.ReactNode;
}) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = new (ClientIO as any)(
            process.env.NEXT_PUBLIC_SOCKET_URL!,
            {
                path: "/api/socket/io",
                addTrailingSlash: false,
            });

            //Adding connect and disconnect listeners
            socketInstance.on("connect", () => {
                setIsConnected(true);
            });

            socketInstance.on("disconnect", () => {
                setIsConnected(false);
            });

             setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}