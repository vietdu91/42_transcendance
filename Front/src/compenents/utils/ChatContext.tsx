import { createContext } from 'react';
import io from "socket.io-client";

export const chatSocket = io(String(process.env.REACT_APP_LOCAL_B));
export const ChatContext = createContext(chatSocket);