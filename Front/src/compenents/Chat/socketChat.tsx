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
        window.location.href = "http://localhost:3000/connect";
    const socket = useContext(ChatContext);
    const [user, setUser] = useState<User>(initUser);
    const userId = Cookies.get('id');

    socket.emit('joinChat', {userId})
    useEffect(() => {
        const getUserData = async () => {
            await axios.get(process.env.REACT_APP_LOCAL_B + "/profile/getUserChat", { withCredentials: true })
                .then(res => {
                    // console.log(res.data.conversations)
                    setUser(res.data);
                })
                .catch(error => {
                    console.log(error);
                })
        }
        getUserData();
    }, []);

    {/** modif Benda */ }
    const [indivConv, setIndivConv] = useState(true);
    const [channelsConv, setChannelsConv] = useState(true);


    const [isConvListVisible, setIsConvListVisible] = useState(false);
    const [isChannelsListVisible, setIsChannelsListVisible] = useState(false);

    const handleIndivConvVisibility = (visibility) => {
        setIndivConv(visibility);
    };

    const handleChannelsConvVisibility = (visibility) => {
        setChannelsConv(visibility);
    };


    const [conversations, setConversations] = useState<string[]>([]); // Add type annotation string[]

    const addConversation = (newConversation: string) => {
        setConversations([...conversations, newConversation]);
    };


    {/* Modif  */ }
    return (
        <>
            <div className="truc">
                <div className="left-part-chat">
                    <div className="conversations-list">
                        <ConversationListHeader
                            name={user.name}
                            pfp={user.pfp}
                            handleVisibility={handleIndivConvVisibility}
                            isConvListVisible={isConvListVisible}
                            setIsConvListVisible={setIsConvListVisible}
                            addConversation={addConversation}
                            user={user}
                        /*Channels */
                        />
                        <ConversationListSummary
                            name={user.name}
                            pfp={user.pfp}
                            indivConv={indivConv}
                            handleVisibility={handleIndivConvVisibility}
                            isConvListVisible={isConvListVisible}
                            setIsConvListVisible={setIsConvListVisible}
                            user={user}
                            convs={user.conversations}
                            /*CHannels */
                            channels={user.channels}
                            handleChannelsConvVisibility={handleChannelsConvVisibility}
                            isChannelsListVisible={isChannelsListVisible}
                            setIsChannelsListVisible={setIsChannelsListVisible}
                        />
                    </div>
                </div>
            </div>
            <FooterMenu />
        </>
    );
}

export default Chat;