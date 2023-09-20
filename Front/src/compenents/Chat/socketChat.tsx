import { useState, useEffect, useRef, useContext } from 'react';
import io, { Socket } from "socket.io-client";
import ReturnButtom from '../utils/ReturnButtom/ReturnButtom';
import MessageInput from '../Messages/messageInput';
import Room from '../Room/room';
import Cookies from 'js-cookie';
import { ChatContext } from '../utils/ChatContext';


import ConversationContainer from './ConversationContainer/ConversationContainer';
import TextComposerContainer from './TextComposerContainer/TextComposerContainer';
import ChatConversationArea from './ChatConversationArea/ChatConversationArea';
import FooterMenu from './FooterMenu/FooterMenu';
import ConversationListSummary from './ConversationListSummary/ConversationListSummary';
import ConversationListHeader from './ConversationListHeader/ConversationListHeader';
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

    const token = Cookies.get('accessToken');
    if (!token)
        window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;
    const socket = useContext(ChatContext);
    const [user, setUser] = useState<User>(initUser);
    const [convs, setConvs] = useState([]);
    const [channels, setChannels] = useState([]);

    socket.emit('joinChat');
    
    const [indivConv, setIndivConv] = useState(true);
    
    const handleIndivConvVisibility = (visibility) => {
        setIndivConv(visibility);
    };
    
    useEffect(() => {
        const getUserData = async () => {
            await axios.get(process.env.REACT_APP_LOCAL_B + '/profile/getUserChat', {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
            .then(res => {
                setUser(res.data);
                setConvs(res.data.conversations);
                setChannels(res.data.channels);
            })
            .catch(error => {
                console.log(error);
            })
        }
        getUserData();
    }, []);

    return (
        <>
            <div className="truc">
                <img className="img-truc" id="img-truc" src={BackgroundWindows}></img>
                <div className="left-part-chat">
                    <div className="conversations-list">
                        <ConversationListHeader
                            name={user.name}
                            pfp={user.pfp}
                            user={user}
                            setConvs={setConvs}
                            setChannels={setChannels}
                        /*Channels */
                        />
                        <ConversationListSummary
                            name={user.name}
                            pfp={user.pfp}
                            indivConv={indivConv}
                            handleVisibility={handleIndivConvVisibility}
                            user={user}
                            convs={convs}
                            /*CHannels */
                            channels={channels}
                        />
                    </div>
                </div>
            </div>
            <FooterMenu />
        </>
    );
}

export default Chat;