import React, { useState, useContext, useEffect } from 'react';
import './ChatConversationArea.css'; // Import your CSS styles
import ConversationContainer from '../ConversationContainer/ConversationContainer'; // Import the ConversationContainer component
import TextComposerContainer from '../TextComposerContainer/TextComposerContainer'; // Import the TextComposerContainer component
import Invite from '../../../img/chat/invite-gimp.jpg';
import InviteGame from '../../../img/chat/game-gimp.jpg';
import Cookies from 'js-cookie';
import { ChatContext } from '../../utils/ChatContext';
import axios from 'axios';

interface User {
  name: string,
  nickname: string,
  pfp: string,
}

const initUser: User = {
  name: "",
  nickname: "",
  pfp: "",
}

function ChatConversationArea({ user, conv, isVisible }) {
  const socket = useContext(ChatContext);
  const userId = Cookies.get('id');

  const [messages, setMessages] = useState<string[]>([]);
  const [otherUser, getOtherUser] = useState<User>(initUser);

  const send = (value: string) => {
    socket?.emit('message', value, userId);
  }

  const messageListener = (newMessage: string) => {
    const authorId = Cookies.get('id');

    setMessages(prevMessages => [...prevMessages, newMessage]);
  }

  useEffect(() => {
    const getUserData = async () => {
      const id = userId == conv.usersID[0] ? conv.usersID[1] : conv.usersID[0];
      await axios.get(process.env.REACT_APP_LOCAL_B + "/profile/getUserChatById", {params: {id: id}})
      .then(response => {
        getOtherUser(response.data);
      })
      .catch(error => {
        console.log(error);
      })
    }
    getUserData();
    socket?.on('message', messageListener);
    return () => {
      socket?.off('message', messageListener);
    }
  }, [messageListener]);

  if (isVisible == false)
    return null;
  return (
    <div className='chat-conversation-area'>
      {isVisible && (
        <div className="individual-convo-main-container">
          <div className="navbar-conv"> {/* faire un degrade  */}
            {/* Content for the navbar */}
            <ul>
              <li><img src={Invite} alt="Invite" id="chat_Invite" /></li>
              <li><img src={InviteGame} alt="InviteGame" id="chat_InviteGame" /></li>
              {/* <li><img src={RedCross} alt="redcross" id="chat_redcross" /></li> */}
              {/* <li></li>
              <li></li> */}
            </ul>
          </div>
          <ConversationContainer name={otherUser.name} nickname={otherUser.nickname} otherpfp={otherUser.pfp} messages={messages} />
          <TextComposerContainer name={user.name} pfp={user.pfp} send={send} messages={messages} />
        </div>
      )}
    </div>
  );
}

export default ChatConversationArea;
