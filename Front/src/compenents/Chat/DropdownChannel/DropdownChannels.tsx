import React, { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { ChatContext } from '../../utils/ChatContext';
import './DropdownChannels.css'

function DropdownChannels() {
  const socket = useContext(ChatContext);
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
          {/* Add content for channel creation */}
          <input type="text" placeholder="Channel Name" />
          <div className="checkboxes-tick">
            <input type="checkbox" id="public" />
            <label htmlFor="public">Public</label>
            <input type="checkbox" id="private" />
            <label htmlFor="private">Private</label>
          </div>
          <input type="text" placeholder="Password" />
          <button onClick={toggleCreateChannel}>Create</button>
        </div>
      )}
      {
        isOpenForJoinChannel && (
          <div className="channel-join-container">
            {/* Add content for channel join */}
            <input type="text" placeholder="Channel Name" />
            {/* fairee apparaitre le password que si il est prive*/}
            <input type="text" placeholder="Password" />
            <button onClick={toggleJoinChannel}>Join</button>
          </div>
        )
      }
      {
        isOpenForDeleteChannel && (
          <div className="channel-delete-container">
            {/* Add content for channel delete */}
            <input type="text" placeholder="Channel Name" />
            <input type="text" placeholder="Password" />
            <button onClick={toggleDeleteChannel}>Delete</button>
          </div>
        )
      }
    </div>
  );
}

export default DropdownChannels;
