import React from 'react';
import { useContext, useState } from 'react';
import Cookies from 'js-cookie';
import { ChatContext } from '../../utils/ChatContext';

import './ConversationListHeader.css';
import RedCross from '../../../img/chat/redcross.png'
import Maximize from '../../../img/chat/rsz_1maximize_1.png'

const ConversationListHeader = ({ name }) => {
    const socket = useContext(ChatContext);
    const [joined, setJoined] = useState(false);
    const [channelName, setChannelName] = useState('');
    const [isRoomCreated, setIsRoomCreated] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false); // État pour définir si la room est privée

    const handleJoin = () => {
        const id = Cookies.get('id');
        socket?.emit('joinRoom', {name: 'test', userId: id});
        setJoined(true);
      };


  const handleCreate = ()=> {
    console.log("Created room:", 'test');
    setChannelName('test');
    setIsRoomCreated(true);
    const id = Cookies.get('id');
    // Émettre le nom de la room, l'indicateur si elle est privée et le mot de passe
    if (isPrivate) {
      socket?.emit('channelName', { name: 'test', ownerId: id, isPrivate });
    } else {
      // Si la room n'est pas privée, n'envoyer que le nom de la room
      socket?.emit('channelName', { name: 'test', ownerId: id });
    }
  };

  const handleDelete = () => {
    console.log("Deleted room:", {name: 'test'});
    setChannelName('');
    setIsRoomCreated(false);
    setIsPrivate(false);
    setJoined(false);
    socket?.emit('deleteRoom', {name: 'test'});
    }


    const handleLeave = () => {
            const id = Cookies.get('id');
            console.log("Left room:", channelName);
            setChannelName('');
            setIsRoomCreated(false);
            setIsPrivate(false);
            setJoined(false);
            socket?.emit('leaveRoom', {name: 'test', userId: id});
        }

    return (
        <div className="conversations-list-header">
            <ul className="top-conversation-list">
                <li className="transcendance-messenger">Transcendance Messenger</li>
                <div className="right-icons">
                    <li><img src={RedCross} alt="redcross" id="chat_redcross" /></li>
                    <li><img src={Maximize} alt="maximize" id="chat_maximize" /></li>
                    <li><img src={RedCross} alt="redcross" id="chat_redcross" /></li>
                </div>
            </ul>
            <ul className="option-conversation-list">
                <li onClick={handleJoin}>Join</li>
                <li onClick={handleCreate}>Create</li>
                <li onClick={handleDelete}>Delete</li>
                <li onClick={handleLeave}>Leave</li>
                <li>Help</li>
            </ul>
            <div className="topbar-conversation-list">
                <div className="profile-pic-messenger"></div>
                <div className="user-informations">
                    <h2 className="username-info">{name} <span className="status-online">(online)</span></h2>
                    <h4 className="status-edit">status to Edit</h4>
                </div>
            </div>
        </div>
    );
};

export default ConversationListHeader;
