import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Room.css';

export default function Room({ room }: { room: string }) {
  const [value, setValue] = useState("");
  const [joined, setJoined] = useState(false);
  const navigate = useNavigate();


  const handleJoin = () => {
    // Effectuer les actions nécessaires lorsqu'on rejoint la salle de discussion
    console.log("Joined room:", value);
    setJoined(true);
    //navigate(`/chat/${value}`); // Redirection vers la salle de chat correspondante
  };

  const handleDelete = () => {
    console.log("Deleted room:", value);
    setValue("");
    setJoined(false);
  };

  const handleCreate = () => {
    console.log("Created room:", value);
    setValue(value);
    setJoined(true);
  };

  return (
    <div className="input-wrapper">
      <input onChange={(e) => setValue(e.target.value)} placeholder="Chat room name..." value={value}/>
      {value && (
        <button onClick={handleCreate}>Create</button>
      )}
      {/* {value && !joined && (
        <button onClick={handleJoin}>Join</button>
      )} */}
      {value && joined && (
        <button onClick={handleDelete}>Delete</button>
      )}
      {joined && <div>Joined room: {value}</div>}
    </div>
  );
}
