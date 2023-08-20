import { useState, useEffect } from 'react';
import io, { Socket } from "socket.io-client";
import ReturnButtom from '../utils/ReturnButtom/ReturnButtom';
import MessageInput from '../Messages/messageInput';
import Room from '../Room/room';
import Cookies from 'js-cookie';


import ConversationContainer from './ConversationContainer/ConversationContainer'; 
import TextComposerContainer from './TextComposerContainer/TextComposerContainer';
import ChatConversationArea from './ChatConversationArea/ChatConversationArea';
import FooterMenu from './FooterMenu/FooterMenu';
import ConversationListSummary from './ConversationListSummary/ConversationListSummary';
import ConversationListHeader from './ConversationListHeader/ConversationListHeader';


import './Chat.css';
import axios from "axios"

function Chat() {

    const token = Cookies.get('accessToken');
    if (!token)
        window.location.href = "http://localhost:3000/connect";
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);
    	let [nick, getNick] = useState("");
	let [name, getName] = useState("");
	let [age, getAge] = useState(0);
	let [pfp_url, getPfpUrl] = useState("");

    useEffect (() => {
		axios.get('http://localhost:3001/Southtrans/getUser', { withCredentials: true })
		.then(response => {
			getNick(response.data.nick);
			getName(response.data.name);
			getAge(response.data.age);
			getPfpUrl(response.data.pfp_url)
		}).catch(error => {
			console.error('Probleme');
		});
	}, [])
    

    //const [value, setValue] = useState("");
    //const [joined, setJoined] = useState(false);
    //const [room, setRoom] = useState("");

    const send = (value: string) => {
        socket?.emit('message', value);
    }

    useEffect(() => {
        // console.log('react api ==== ' + process.env.REACT_APP_ENDPOINT);
        const apiEndpoint = 'http://localhost:3001';
        const newSocket = io(apiEndpoint);
        setSocket(newSocket);
    }, [setSocket]);

    const messageListener = (newMessage: string) => {
        const authorId = Cookies.get('id');

        setMessages(prevMessages => [...prevMessages, newMessage]);

        fetch('http://localhost:3001/Southtrans/savedMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newMessage, authorId }),
        });
    }

    useEffect(() => {
        socket?.on('message', messageListener);
        return () => {
            socket?.off('message', messageListener);
        }
    }, [messageListener]);

    return (
        <>
            <div className="truc">
                <div className="left-part-chat">
                    <div className="conversations-list">
                        <ConversationListHeader name={name} />
                        <ConversationListSummary />
                    </div>
                </div>
                <ChatConversationArea />
            </div>
            <FooterMenu />
        </>
    );
}

export default Chat;