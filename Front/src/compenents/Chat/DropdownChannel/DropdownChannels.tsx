import React, { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { ChatContext } from '../../utils/ChatContext';
import './DropdownChannels.css'
import RedCross from "../../../img/chat/redcross.png"
function DropdownChannels() {
  const socket = useContext(ChatContext);
  const [joined, setJoined] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [isRoomCreated, setIsRoomCreated] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenForCreateChannel, setIsOpenForCreateChannel] = useState(false);
  const [isOpenForJoinChannel, setIsOpenForJoinChannel] = useState(false);
  const [isOpenForDeleteChannel, setIsOpenForDeleteChannel] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false); // État pour définir si la room est privée

  const toggleChannels = () => {
    setIsOpen(!isOpen);
  };

  const toggleCreateChannel = () => {
    const id = Cookies.get('id');
    // Émettre le nom de la room, l'indicateur si elle est privée et le mot de passe
     if (isPrivate) {
       socket?.emit('channelName', { name: 'test', ownerId: id, isPrivate });
    } else {
      // Si la room n'est pas privée, n'envoyer que le nom de la room
      socket?.emit('channelName', { name: 'test', ownerId: id });
    }
      setIsOpenForCreateChannel(!isOpenForCreateChannel);
  };

  const toggleJoinChannel = () => {
    const id = Cookies.get('id');
    socket?.emit('joinRoom', {name: 'test', userId: id});
    setIsOpenForJoinChannel(true);
  };

  const toggleDeleteChannel = () => {
     socket?.emit('deleteRoom', {name: 'test'});
    setIsOpenForDeleteChannel(!isOpenForDeleteChannel);
  };

  const handleJoin = () => {
    const id = Cookies.get('id');
    socket?.emit('joinRoom', { name: 'test', userId: id });
    setJoined(true);
  };


  const handleCreate = () => {
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
    console.log("Deleted room:", { name: 'test' });
    setChannelName('');
    setIsRoomCreated(false);
    setIsPrivate(false);
    setJoined(false);
    socket?.emit('deleteRoom', { name: 'test' });
  }


  const handleLeave = () => {
    const id = Cookies.get('id');
    console.log("Left room:", channelName);
    setChannelName('');
    setIsRoomCreated(false);
    setIsPrivate(false);
    setJoined(false);
    socket?.emit('leaveRoom', { name: 'test', userId: id });
  }

  const handleBan = () => {
    const id = Cookies.get('id');
    console.log("Banned user:", id);
    socket?.emit('banRoom', { name: 'test', userId: id });
  }

  const handleKik = () => {
    const id = Cookies.get('id');
    console.log("Kicked user:", id);
    socket?.emit('kickUser', { name: 'test', userId: id });
  }

  const handleSetAdmin = () => {
    const id = Cookies.get('id');
    console.log("Set admin:", id);
    socket?.emit('setAdmin', { name: 'test', userId: id });
  }

  return (
    <div className="dropdown">
      <div className="dropdown-toggle" onClick={toggleChannels}>
        Channels
      </div>
      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={toggleCreateChannel}>Create Channel</li>
          <li onClick={toggleJoinChannel}>Join Channel</li>
          <li onClick={toggleDeleteChannel}>Delete Channel</li>
        </ul>
      )}
      {isOpenForCreateChannel && (
        <div className="channel-creation-container">
          <div className="channel-creation-navbar">
            <img src={RedCross} alt="redcross" id="chat_redcross" />
          </div>
          <div className="channel-creation-form">
            <div className="fiiiirst">
            <input
              type="text"
              placeholder="Channel Name"
              onChange={(e) => setChannelName(e.target.value)} // Capture the channel name
            />
            </div>
            <div className="checkboxes-tick">
              <input type="checkbox" id="public" />
              <label htmlFor="public">Public</label>
              <input type="checkbox" id="private" />
              <label htmlFor="private">Private</label>
            </div>
            {/*
            <input type="text" placeholder="Password" />
            <button onClick={() => { handleCreate(); toggleCreateChannel(); }}>Create</button> */}
          </div>
        </div>
      )}
      {
        isOpenForJoinChannel && (
          <div className="channel-join-container">
            {/* Add content for channel join */}
            <input type="text" placeholder="Channel Name"
              onChange={(e) => setChannelName(e.target.value)}
            />
            {/* fairee apparaitre le password que si il est prive*/}
            <input type="text" placeholder="Password" />
            {/* ajouter  */}
            <button onClick={() => { handleJoin(); toggleJoinChannel(); }}>Join</button>
          </div>
        )
      }
      {
        isOpenForDeleteChannel && (
          <div className="channel-delete-container">
            {/* Add content for channel delete */}
            <input type="text" placeholder="Channel Name"
              onChange={(e) => setChannelName(e.target.value)}
            />
            <input type="text" placeholder="Password" />
            <button onClick={() => { handleDelete(); toggleDeleteChannel(); }}>Delete</button>
          </div>
        )
      }
    </div>
  );
}

export default DropdownChannels;
