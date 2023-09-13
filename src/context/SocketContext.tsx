
import React, { createContext, ReactNode } from 'react';
import { useSockets } from '../hooks/useSockets';
import { Socket } from 'socket.io-client'; // Importa el tipo Socket de la librería socket.io-client

type SocketType = {
    socket: Socket; // Utiliza el tipo Socket para el objeto de socket
    online: boolean;
};

type SocketProviderProps = {
    children: ReactNode;
};

export const SocketContext = createContext<SocketType>({}as SocketType);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => { 
    const { socket, online } = useSockets('http://localhost:8080');

    return (
        <SocketContext.Provider value={{
            socket,
            online
        }}>
            {children}
        </SocketContext.Provider>
    );
};