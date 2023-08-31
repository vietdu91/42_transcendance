import React, { useState } from 'react';
import './DropdownContact.css';

function DropdownContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFriends, setIsOpenFriends] = useState(false);

  const toggleFriendsList = () => {
	setIsOpenFriends(!isOpenFriends);
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-contact">
      <div className="dropdown-contact-toggle" onClick={toggleMenu}>
        Friends
      </div>
      {isOpen && ( /*Friends list  */
	  /* du coup map de la liste d'amis et on click sur le le */
	  /*utiliser le toggle friends list */
        <ul className="dropdown-contact-menu">
          <li>Add</li>
          <li>Invite</li>
          <li>Delete</li>
          <li>Block</li>
          <li>Send Mp</li>
        </ul>
      )}
    </div>
  );
}

export default DropdownContact;