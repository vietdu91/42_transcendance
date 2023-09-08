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
    let [nick, getNick] = useState("");
	let [name, getName] = useState("");
	let [age, getAge] = useState(0);
	let [pfp_url, getPfpUrl] = useState("");
    

    useEffect(() => {
        axios.get(process.env.REACT_APP_LOCAL_B + '/profile/getUser', { withCredentials: true })
        .then(response => {
            getNick(response.data.nick);
            getName(response.data.name);
            getAge(response.data.age);
            getPfpUrl(response.data.pfp_url)
        }).catch(error => {
            console.error('Probleme');
        });
       // console.log('react api ==== ' + process.env.REACT_APP_ENDPOINT);

    },[]);

  

    return (
        <>
            <div className="truc">
                <div className="left-part-chat">
                    <div className="conversations-list">
                        <ConversationListHeader name={name} pfp={pfp_url}/>
                        <ConversationListSummary name={name} pfp={pfp_url}/>
                    </div>
                </div>
            </div>
            <FooterMenu />
        </>
    );
}

export default Chat;