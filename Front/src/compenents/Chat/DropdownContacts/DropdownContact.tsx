import React, { useState, useContext, useEffect } from 'react';
import './DropdownContact.css';
import axios from 'axios';
import Cookie from 'js-cookie';
import { ChatContext } from '../../utils/ChatContext';

import ChatConversationArea from '../ChatConversationArea/ChatConversationArea';

interface OtherUser {
  name: string,
  nickname: string,
  pfp: string,
  // state: number,
}

const initUser: OtherUser = {
  name: "",
  nickname: "",
  pfp: "",
}

function DropdownContact({ user }) {
  const userId = Cookie.get('id');
  const socket = useContext(ChatContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFriends, setIsOpenFriends] = useState(false);
  const [isOpenForSendMp, setIsOpenForSendMp] = useState(false);
  const [isOpenForAddFriend, setIsOpenForAddFriend] = useState(false);
  const [isOpenForInvite, setIsOpenForInvite] = useState(false);
  const [isOpenForDelete, setIsOpenForDelete] = useState(false);
  const [isOpenForBlock, setIsOpenForBlock] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [otherUser, setOtherUser] = useState<OtherUser>(initUser)
  const [conv, setConv] = useState()

  const toggleFriendsList = () => {
    setIsOpenFriends(!isOpenFriends);
  };

  const handleInputChange = (event) => {
    setFriendName(event.target.value);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleAddFriend = () => {
    setIsOpenForAddFriend(!isOpenForAddFriend);
  };

  const toggleInvite = () => {
    setIsOpenForInvite(!isOpenForInvite);
  };

  const toggleDelete = () => {
    setIsOpenForDelete(!isOpenForDelete);
  };

  const toggleBlock = () => {
    setIsOpenForBlock(!isOpenForBlock);
  };

  const toggleSendMp = () => {
    setIsOpenForSendMp(!isOpenForSendMp);
  };


  const searchUser = async () => {
    await axios.get(process.env.REACT_APP_LOCAL_B + '/profile/getUserByName', { params: { username: friendName } })
      .then(response => {
        console.log(response.data)
        socket?.emit('createConversation', { id: userId, otherName: response.data.name })
      })
      .catch(error => {
        console.log(error);
      })
  };

  useEffect(() => {
    socket.on('conversationCreated', (response) => {
      console.log(response);
      setOtherUser(response.otherUser);
      setConv(response.conversation);
    })
  }, []);

  return (
    <div className="dropdown-contact">
      <div className="dropdown-contact-toggle" onClick={toggleMenu}>
        Friends
      </div>
      {isOpen && (
        <ul className="dropdown-contact-menu">
          <li onClick={toggleAddFriend}>Add friend request</li>
          <li onClick={toggleInvite}>Invite</li>
          <li onClick={toggleDelete}>Delete</li>
          <li onClick={toggleBlock}>Block</li>
          <li onClick={() => { toggleSendMp() }}>Send Mp</li>
        </ul>
      )}
      {isOpenForInvite && (
        <div className="channel-delete-container">
          <input type="text" placeholder="Friend's Name" />
          <button onClick={() => toggleInvite()}>ENTER</button>
        </div>
      )}
      {isOpenForAddFriend && (
        <div className="channel-delete-container">
          <input type="text" placeholder="Friend's Name" />
          <button onClick={() => toggleAddFriend()}>ENTER</button>
        </div>
      )}
      {isOpenForDelete && (
        <div className="channel-delete-container">
          <input type="text" placeholder="Who do you want to delete" />
          <button onClick={() => toggleDelete()}>ENTER</button>
        </div>
      )}
      {isOpenForBlock && (
        <div className="channel-delete-container">
          <input type="text" placeholder="Friend's Name" />
          <button onClick={() => toggleBlock()}>ENTER</button>
        </div>
      )}
      {isOpenForSendMp && (
        <div className="channel-delete-container">
          <input
            type="text"
            placeholder="Friend's Name"
            value={friendName}
            onChange={handleInputChange}
          />
          <button onClick={() => { searchUser(); toggleSendMp() }}>ENTER</button>
          {isVisible && (
            <ChatConversationArea 
              user={user}
              conv={conv}
              isVisible={isVisible}
              
            />
          )}
        </div>
      )}
    </div>
  );
}

export default DropdownContact;
