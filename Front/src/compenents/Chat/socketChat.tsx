import { useState , useEffect } from 'react';
import io , { Socket } from "socket.io-client";
import Message from '../Messages/message';
import MessageInput from '../Messages/messageInput';

function Chat() {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);

    const send = (value: string) => {
        socket?.emit('message', value);
    }
    
    useEffect(() => {
        const newSocket = io("http://localhost:3001");
        setSocket(newSocket);
    }, [setSocket]);

    const messageListener = (newMessage: string) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
    }

    useEffect(() => {
        socket?.on('message', messageListener);
        return () => {
            socket?.off('message', messageListener);
        }
    }, [messageListener]);

    return (
        <>
            <MessageInput send={send}/>
            <Message message={messages}/>
        </>
    ); 
}

export default Chat;
