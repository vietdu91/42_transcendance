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
  state: number,
}

const initUser: OtherUser = {
  name: "",
  nickname: "",
  pfp: "",
  state: 0,
}

function DropdownContact({ user, setConvs }) {
  const token = Cookie.get('accessToken')
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

  const accessToken = Cookie.get('accessToken');

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const toggleFriendsList = () => {
    setIsOpenFriends(!isOpenFriends);
  };

  const handleInputChange = (event) => {
    setFriendName(event.target.value);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleAddFriend = async () => {
    setIsOpenForAddFriend(!isOpenForAddFriend);

  };

  const handleAddFriend = async () => {
    if (friendName) {
      try {

        const response = await axios.post(
          `${process.env.REACT_APP_LOCAL_B}/profile/addFriend`,
          { name: friendName,
            userId: userId},
          { headers }
        );
        setNotFound(false);
        setIsVisible(true);
        console.log("friendName === " + friendName);
        setFriendName('');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteFriend = async () => {
    if (friendName) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_LOCAL_B}/profile/removeFriend`,
          { name: friendName, userId: userId},
          { headers }
        );
      }
      catch (error) {
        console.error(error);
      }
    }
  };


  const handleBlockFriend = async () => {
    if (friendName) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_LOCAL_B}/profile/addBlocked`,
          { name: friendName, userId: userId},
          { headers }
        );
      }
      catch (error) {
        console.error(error);
      }
    }
  };
  


  const toggleInvite = () => {
    setIsOpenForInvite(!isOpenForInvite);
  };

  const toggleDelete = async () => {
    setIsOpenForDelete(!isOpenForDelete);
  };

  const toggleBlock = async () => {
    setIsOpenForBlock(!isOpenForBlock);

  };

  const toggleSendMp = () => {
    setIsOpenForSendMp(!isOpenForSendMp);
  };


  const searchUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL_B}/profile/getUserByName`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            username: friendName,
          },
        }
      );
  
      console.log(response.data);
      socket?.emit('createConversation', { id: userId, otherName: response.data.name });
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(() => {
    socket.on('conversationCreated', (response) => {
      console.log(response);
      setOtherUser(response.otherUser);
      setConvs(response.conversations);
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
          <input type="text" placeholder="Friend's Name"
            value={friendName}
            onChange={handleInputChange} />
          <button onClick={() =>  { handleAddFriend(); toggleAddFriend() }}>ENTER</button>
        </div>
      )}
      {isOpenForDelete && (
        <div className="channel-delete-container">
          <input type="text" placeholder="Who do you want to delete" 
            value={friendName}
            onChange={handleInputChange} />
          <button onClick={() => { handleDeleteFriend(); toggleDelete()}}>ENTER</button>
        </div>
      )}
      {isOpenForBlock && (
        <div className="channel-delete-container">
          <input type="text" placeholder="Friend's Name" 
            value={friendName}
            onChange={handleInputChange} />
          <button onClick={() => {handleBlockFriend(); toggleBlock()}}>ENTER</button>
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

export default DropdownContact