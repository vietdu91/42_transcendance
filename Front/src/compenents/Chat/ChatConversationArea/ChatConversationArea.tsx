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

interface Message {
  content: string,
  date: Date,
  authorId: number,
}

const initUser: User = {
  name: "",
  nickname: "",
  pfp: "",
}

function ChatConversationArea({ user, conv, isVisible }) {
  const socket = useContext(ChatContext);
  const userId = Cookies.get('id');

  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, getOtherUser] = useState<User>(initUser);

  const send = (value: string) => {
    const convId = conv.id;
    console.log("hihihiha")
    socket?.emit('sendMessageConv', {value, userId, convId});
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
    socket?.on('messageSent', (res => {
      console.log(res.message);
      console.log(res.messages);
      let newMessages: Message[] = [];
      for (let i = 0; i < res.messages.length; i++) {
        newMessages.push({
          content: res.messages[i].content,
          date: res.messages[i].createdAt,
          authorId: res.messages[i].authorId,
        })
      }
      setMessages(newMessages);
    }));
    return () => {
      socket?.off('message');
    }
  }, []);

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
          <ConversationContainer name={otherUser.name} nickname={otherUser.nickname} otherpfp={otherUser.pfp} messages={messages}/>
          <TextComposerContainer name={user.name} pfp={user.pfp} send={send} />
        </div>
      )}
    </div>
  );
}

export default ChatConversationArea;
