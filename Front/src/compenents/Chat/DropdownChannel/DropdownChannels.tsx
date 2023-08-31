import React, { useState } from 'react';
import './DropdownChannels.css'

function DropdownChannels() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChannels = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-toggle" onClick={toggleChannels}>
        Channels
      </div>
      {isOpen && (
        <ul className="dropdown-menu">
          <li>Create Channel</li>
          <li>Join Channel</li>
          <li>Delete Channel</li>
        </ul>
      )}
    </div>
  );
}

export default DropdownChannels;