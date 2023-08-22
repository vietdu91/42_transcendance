import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io , { Socket } from "socket.io-client";
import MessageInput from '../Messages/messageInput';
import Cookies from 'js-cookie';
import './Room.css'; // Assurez-vous d'avoir le fichier styles.css dans le même répertoire

interface RoomProps {
  room: string;
}

const Room: React.FC<RoomProps> = ({ room }) => {
  const [channelName, setChannelName] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket>();
  const navigate = useNavigate();


  useEffect(() => {
    // console.log('react api ==== ' + process.env.REACT_APP_ENDPOINT);
     const apiEndpoint = 'http://localhost:3001';
     const newSocket = io(apiEndpoint);
     setSocket(newSocket);
    }, [setSocket]);

    const send = (value: string) => {
      const id = Cookies.get('id');
      socket?.emit('message', value, id);
  }

  const handleDelete = () => {
    console.log("Deleted room:", channelName);
    setChannelName('');
    setJoined(false);
  };

  const handleCreate = ()=> {
    console.log("Created room:", channelName);
    setChannelName(channelName);
    setJoined(true);
    const id = Cookies.get('id');
    socket?.emit('channelName', channelName, id);
  };

  useEffect(() => {
    socket?.on('channelCreated', (response) => {
      console.log(response.name);
    });
    return () => {
        socket?.off('channelCreated');
    }
}, []);

  

  const handleSendMessage = (message: string) => {
    if (message.trim() !== '') {
      setMessages([...messages, message]);
    }
  };
  return (
    <div className="chat-room-container">
      <div className="chat-info">
        <input
          onChange={(e) => setChannelName(e.target.value)}
          placeholder="Chat room name..."
          value={channelName}
        />
        {channelName && (
          <button onClick={handleCreate}>Create</button>
        )}
        {channelName && joined && (
          <button onClick={handleDelete}>Delete</button>
        )}
        {joined && <div>Joined room: {channelName}</div>}
      </div>
      {joined && (
        <div className="chat-container">
          <div className="chat-messages" id="chatMessages">
            {messages.map((message, index) => (
              <div className="message" key={index}>
                <strong>Utilisateur Anonyme:</strong> {message}
              </div>
            ))}
          </div>
          <div className="chat-input">
            {/* Utilisez le composant MessageInput ici */}
            <MessageInput send={send} messages={messages} />
            {/* Fin du composant MessageInput */}
          </div>
        </div>
      )}
    </div>
  );
};
export default Room;
