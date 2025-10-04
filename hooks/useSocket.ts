import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
    userId?: string;
    room?: string;
}

interface SocketMessage {
    room: string;
    from: string;
    content: string;
    at: number;
}

export const useSocket = (options: UseSocketOptions = {}) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { userId, room } = options;

    useEffect(() => {
        socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}/ws`, {
            query: {
                userId: userId || 'anonymous',
                ...(room && { room }),
            },
            withCredentials: true,
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            socket.disconnect();
        };
    }, [userId, room]);

    const joinRoom = (roomName: string) => {
        socketRef.current?.emit('room:join', { room: roomName });
    };

    const leaveRoom = (roomName: string) => {
        socketRef.current?.emit('room:leave', { room: roomName });
    };

    const sendMessage = (room: string, content: string) => {
        return new Promise((resolve, reject) => {
            socketRef.current?.emit('message:send', { room, content }, (response: any) => {
                if (response?.delivered) {
                    resolve(response);
                } else {
                    reject(new Error('Message not delivered'));
                }
            });
        });
    };

    return {
        socket: socketRef.current,
        isConnected,
        joinRoom,
        leaveRoom,
        sendMessage,
    };
};
