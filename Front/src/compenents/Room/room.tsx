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
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false); // État pour définir si la room est privée
  const [password, setPassword] = useState(''); // État pour stocker le mot de passe de la room

  useEffect(() => {
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
    setIsRoomCreated(false);
    setIsPrivate(false);
    setPassword('');
  
    setJoined(false);
  };

  const handleCreate = ()=> {
    console.log("Created room:", channelName);
    setChannelName(channelName);
    setIsRoomCreated(true);
    const id = Cookies.get('id');
    // Émettre le nom de la room, l'indicateur si elle est privée et le mot de passe
    socket?.emit('channelName', channelName, id, isPrivate, password);
  };

  useEffect(() => {
    socket?.on('channelCreated', (response) => {
      console.log(response.name);
    });
    return () => {
      socket?.off('channelCreated');
    }
  }, []);

  const handleJoin = () => {
    const id = Cookies.get('id');
    socket?.emit('joinRoom', channelName, id);
    setJoined(true);
  };

  return (
    <div className="chat-room-container">
      <div className="chat-info">
        {isRoomCreated ? (
          <>
            <div>Room Name: {channelName}</div>
            <div>Private: {isPrivate ? 'Yes' : 'No'}</div>
            {isPrivate && <div>Password: {password}</div>}
            <button onClick={handleJoin}>Join</button>
            <button onClick={handleDelete}>Delete</button>
          </>
        ) : (
          <>
            <input
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Chat room name..."
              value={channelName}
            />
            {/* Case à cocher pour définir la room comme privée */}
            <label>
              Private:
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
              />
            </label>
            {/* Champ de saisie de texte pour le mot de passe si la room est privée */}
            {isPrivate && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
            <button onClick={handleCreate}>Create</button>
          </>
        )}
        {joined && <div>Joined room: {channelName}</div>}
      </div>
      {joined && (
        <div className="chat-container">
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