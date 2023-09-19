import { createContext } from 'react';
import io from "socket.io-client";
import Cookie from 'js-cookie'

const accessToken = Cookie.get('accessToken')

export const chatSocket = io(String(process.env.REACT_APP_LOCAL_B) + `?token=${accessToken}`);
export const ChatContext = createContext(chatSocket);
