import React, { useState, useContext, useEffect } from 'react';
import './ChatConversationArea.css'; // Import your CSS styles
import ConversationContainer from '../ConversationContainer/ConversationContainer'; // Import the ConversationContainer component
import TextComposerContainer from '../TextComposerContainer/TextComposerContainer'; // Import the TextComposerContainer component
import Invite from '../../../img/chat/invite-gimp.jpg';
import InviteGame from '../../../img/chat/game-gimp.jpg';
import Cookie from 'js-cookie';
import { ChatContext } from '../../utils/ChatContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

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

function ChatConversationArea({ user, conv, isVisible, blocked }) {
  const token = Cookie.get('accessToken')
  const socket = useContext(ChatContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState(conv.messages.filter((index) => !(blocked.includes(index.authorId))));
  const [otherUser, getOtherUser] = useState<User>(initUser);

  const inviteToGame = async () => {
    socket?.emit('sendMessageConv', { value: "Viens jouer ! Clique sur le bouton Games !", convId: conv.id })
  }

  const goPersonalMatchmaking = () => {
    navigate(`/champselect?other=${otherUser.name}`);
  }

  const send = async (value: string) => {
    socket?.emit('sendMessageConv', { value, convId: conv.id });
  }

  useEffect(() => {
    const getUserData = async () => {
      await axios.get(process.env.REACT_APP_LOCAL_B + "/profile/getUserChatById", { params: { ids: conv.usersID }, headers: { 'Authorization': `Bearer ${token}` } })
        .then(response => {
          getOtherUser(response.data);
        })
        .catch(error => {
          if (error.response.status === 401) {
            Cookie.remove('accessToken')
            window.location.href = "/";
          }
        });
      socket.on('messageSentConv', (res => {
        axios.get(process.env.REACT_APP_LOCAL_B + "/chat/getMessagesByConv", { params: { id: conv.id }, headers: { 'Authorization': `Bearer ${token}` } })
          .then(response => {
            setMessages(response.data.messages);
          })
          .catch(error => {
            if (error.response.status === 401) {
							Cookie.remove('accessToken')
							window.location.href = "/";
						}
          })
      }));
    }
    getUserData();
    return () => {
      socket.off('messageSentConv');
    }
  }, [conv.usersID, socket, conv.id, token]);

  if (isVisible === false)
    return null;
  return (
    <div className='chat-conversation-area'>
      {isVisible && (
        <div className="individual-convo-main-container">
          <div className="navbar-conv"> {/* faire un degrade  */}
            {/* Content for the navbar */}
            <ul>
              <li><img src={Invite} alt="Invite" id="chat_Invite" onClick={inviteToGame} /></li>
              <li><img src={InviteGame} alt="InviteGame" id="chat_InviteGame" onClick={goPersonalMatchmaking} /></li>
              {/* <li><img src={RedCross} alt="redcross" id="chat_redcross" /></li> */}
              {/* <li></li>
              <li></li> */}
            </ul>
          </div>
          <ConversationContainer name={otherUser.name} nickname={otherUser.nickname} otherpfp={otherUser.pfp} messages={messages} />
          <TextComposerContainer name={user.name} pfp={user.pfp} send={send} />
        </div>
      )}
    </div>
  );
}

export default ChatConversationArea;
