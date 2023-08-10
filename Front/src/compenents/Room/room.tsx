import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Room.css'; // Assurez-vous d'avoir le fichier styles.css dans le même répertoire

interface RoomProps {
  room: string;
}

const Room: React.FC<RoomProps> = ({ room }) => {
  const [channelName, setChannelName] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleJoin = () => {
    // Effectuer les actions nécessaires lorsqu'on rejoint la salle de discussion
    console.log("Joined room:", channelName);
    setJoined(true);
    //navigate(`/chat/${channelName}`); // Redirection vers la salle de chat correspondante
  };

  const handleDelete = () => {
    console.log("Deleted room:", channelName);
    setChannelName('');
    setJoined(false);
  };

  const handleCreate = () => {
    console.log("Created room:", channelName);
    setChannelName(channelName);
    setJoined(true);
  };

  const handleSendMessage = (message: string) => {
    if (message.trim() !== '') {
      setMessages([...messages, message]);
    }
  };

  return (
    <div className="chat-room-container">
      <div className="chat-info">
        <input onChange={(e) => setChannelName(e.target.value)} placeholder="Chat room name..." value={channelName} />
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
            <input
              type="text"
              id="messageInput"
              placeholder="Tapez votre message ici..."
              value={''} // Ici, nous pouvons laisser le value vide car le message sera géré par le composant Chat
            />
            <button id="sendButton" onClick={() => handleSendMessage('Hello from Room!')}>
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;
