import React, {useState, useContext, useEffect} from 'react';
import './ChatConversationArea.css'; // Import your CSS styles
import ConversationContainer from '../ConversationContainer/ConversationContainer'; // Import the ConversationContainer component
import TextComposerContainer from '../TextComposerContainer/TextComposerContainer'; // Import the TextComposerContainer component
import Invite from '../../../img/chat/invite-gimp.jpg';
import InviteGame from '../../../img/chat/game-gimp.jpg';
import Cookies from 'js-cookie';
import { ChatContext } from '../../utils/ChatContext';


type ChatConversationAreaProps = {
  name: string;
  isVisible: boolean;
  pfp: any; // Add the `pfp` prop with the appropriate type
};


function ChatConversationArea({ name, isVisible, pfp }: ChatConversationAreaProps) {
  const socket = useContext(ChatContext);
  
  const [messages, setMessages] = useState<string[]>([]);

  const send = (value: string) => {
      const id = Cookies.get('id');
      socket?.emit('message', value, id);
  }






  const messageListener = (newMessage: string) => {
    const authorId = Cookies.get('id');

    setMessages(prevMessages => [...prevMessages, newMessage]);
}
  
  useEffect(() => {
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
          <ConversationContainer messages={messages} />
          <TextComposerContainer name={name} pfp={pfp} send={send} messages={messages} />
        </div>
      )}
    </div>
  );
}

export default ChatConversationArea;
