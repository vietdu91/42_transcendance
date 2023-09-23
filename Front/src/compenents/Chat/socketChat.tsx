import React, { useState, useEffect, useRef, useContext } from 'react';
import Cookie from 'js-cookie';
import { ChatContext, chatSocket } from '../utils/ChatContext';
import { useNavigate } from "react-router-dom"
import Logo from '../../img/chat/group-conv.png';

import FooterMenu from './FooterMenu/FooterMenu';
import ConversationListSummary from './ConversationListSummary/ConversationListSummary';
import ConversationListHeader from './ConversationListHeader/ConversationListHeader';
import SnackBarCustom from '../utils/SnackBarCustom/SnackBarCustom'
import BackgroundWindows from './windows-xp-wallpaper-bliss.jpg'

import './Chat.css';
import axios from "axios"

interface Channel {
    id: number;
    name: string;
    owner: User;
    ownerId: number;
    isPrivate: boolean;
    usersList: User[];
    banList: User[];
    adminList: User[];
    messages: Message[];
}

interface Message {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author: User | null;
    authorId: number | null;
    conversation: Conversation | null;
    conversationId: number | null;
    channel: Channel | null;
    channelId: number | null;
}

interface Conversation {
    id: number;
    users: User[];
    usersID: number[];
    names: string[];
    messages: Message[];
    date: Date;
}

interface User {
    id: number;
    name: string;
    nickname: string | null;
    age: number | null;
    pfp: string | null;
    friendsList: number[];
    blockList: number[];
    conversations: Conversation[];
    channels: Channel[];
}

const initUser: User = {
    id: -1,
    name: "",
    nickname: "",
    age: -1,
    pfp: "",
    friendsList: [],
    blockList: [],
    conversations: [],
    channels: [],
}

function Chat() {

    const token = Cookie.get('accessToken');
    const socket = useContext(ChatContext);
    if (!token)
        window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;
    const [user, setUser] = useState<User>(initUser);
    const [convs, setConvs] = useState([]);
    const [channels, setChannels] = useState([]);
    const [friends, setFriends] = useState([]);
    const [blocked, setBlocked] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const navigate = useNavigate();


    const [indivConv, setIndivConv] = useState(true);
    const [dragging, setDragging] = useState(false);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
        console.log("handleMouseDown")

        setDragging(true);
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setOffsetX(e.clientX - rect.left);
            setOffsetY(e.clientY - rect.top);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (dragging && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const limitX = window.innerWidth - rect.width;
            const limitY = window.innerHeight - rect.height;
            
            const newX = Math.min(Math.max(e.clientX - offsetX, 0), limitX);
            const newY = Math.min(Math.max(e.clientY - offsetY, 0), limitY);
            console.log("handleMouseMove")

            ref.current.style.left = `${newX}px`;
            ref.current.style.top = `${newY}px`;
        }
    };
    const handleMouseUp = (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
        console.log("handleMouseUp");
        setDragging(false);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove as any);
        window.addEventListener("mouseup", handleMouseUp as any);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove as any);
            window.removeEventListener("mouseup", handleMouseUp as any);
        };
    }, [dragging]);

    const handleIndivConvVisibility = (visibility) => {
        setIndivConv(visibility);
    };

    useEffect(() => {
        // socket.on('connect', () => {});
        socket?.emit('joinChat');
        socket.on('errorSocket', (response) => {
            setSnackMessage(response.message);
            setSnackbarOpen(true);
        })
        socket.on('errorJoinChat', () => {
            navigate("/");
        })
        const getUserData = async () => {
            await axios.get(process.env.REACT_APP_LOCAL_B + '/profile/getUserChat', { withCredentials: true, headers: { "Authorization": `Bearer ${token}` } })
                .then(res => {
                    setUser(res.data);
                    setConvs(res.data.conversations);
                    setChannels(res.data.channels);
                    setFriends(res.data.friends);
                    setBlocked(res.data.blocks);
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        Cookie.remove('accessToken')
                        window.location.href = "/";
                    }
                })
        }
        getUserData();
        return () => {
            socket.disconnect();
        }
    }, [navigate, socket, token]);

    return (

        <div
            style={{ width: '100vw', height: '100vh', position: 'relative' }}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDragging(false)}
        >
            <ChatContext.Provider value={chatSocket}>
                <img className="img-truc" id="img-truc" src={BackgroundWindows}></img>
                <div className="truc" >
                    <div className="left-part-chat" >
                        <div className="conversations-list" ref={ref}>
                            <ul className="top-conversation-list" onMouseDown={handleMouseDown}>
                                <li className="icon-messenger"><img src={Logo} alt="logo" id="logo" /></li>
                                <li className="transcendance-messenger">Transcendence Messenger</li>
                                <div className="clh-right-icons">
                                    <li><button className="chat-icons-messenger" aria-label="Minimize"></button></li>
                                    <li><button className="chat-icons-messenger" aria-label="Maximize"></button></li>
                                    <li><button className="chat-icons-messenger" aria-label="Close" onClick={() => navigate("/")}></button></li>
                                </div>
                            </ul>
                            <ConversationListHeader
                                name={user.name}
                                pfp={user.pfp}
                                user={user}
                                setConvs={setConvs}
                                setChannels={setChannels}
                                setFriends={setFriends}
                            />
                            <ConversationListSummary
                                name={user.name}
                                pfp={user.pfp}
                                indivConv={indivConv}
                                handleVisibility={handleIndivConvVisibility}
                                user={user}
                                convs={convs}
                                channels={channels}
                                friends={friends}
                                blocked={blocked}
                            />
                        </div>
                    </div>
                </div>
                <SnackBarCustom open={snackbarOpen} setOpen={setSnackbarOpen} message={snackMessage} />
                <FooterMenu />
            </ChatContext.Provider>
        </div>
    );
}

export default Chat;