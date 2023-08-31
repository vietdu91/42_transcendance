import React, { useState } from 'react';
import './DropdownChannels.css'

function DropdownChannels() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenForCreateChannel, setIsOpenForCreateChannel] = useState(false);
  const [isOpenForJoinChannel, setIsOpenForJoinChannel] = useState(false);
  const [isOpenForDeleteChannel, setIsOpenForDeleteChannel] = useState(false);

  const toggleChannels = () => {
    setIsOpen(!isOpen);
  };

  const toggleCreateChannel = () => {
    setIsOpenForCreateChannel(!isOpenForCreateChannel);
  };

  const toggleJoinChannel = () => {
    setIsOpenForJoinChannel(!isOpenForJoinChannel);
  };

  const toggleDeleteChannel = () => {
    setIsOpenForDeleteChannel(!isOpenForDeleteChannel);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-toggle" onClick={toggleChannels}>
        Channels
      </div>
      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={toggleCreateChannel}>Create Channel</li>
          <li onClick={toggleJoinChannel}>Join Channel</li>
          <li onClick={toggleDeleteChannel}>Delete Channel</li>
        </ul>
      )}
      {isOpenForCreateChannel && (
        <div className="channel-creation-container">
          {/* Add content for channel creation */}
          <input type="text" placeholder="Channel Name" />
          <button onClick={toggleCreateChannel}>Create</button>
        </div>
      )}
      {
        isOpenForJoinChannel && (
          <div className="channel-join-container">
          {/* Add content for channel join */}
          <input type="text" placeholder="Channel Name" />
          <button onClick={toggleJoinChannel}>Join</button>
          </div>
        )
      }
      {
        isOpenForDeleteChannel && (
          <div className="channel-delete-container">
          {/* Add content for channel delete */}
          <input type="text" placeholder="Channel Name" />
          <button onClick={toggleDeleteChannel}>Delete</button>
          </div>  
        )
      }
    </div>
  );
}

export default DropdownChannels;
