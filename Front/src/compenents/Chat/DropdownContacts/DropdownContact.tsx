import React, { useState } from 'react';
import './DropdownContact.css';
import axios from 'axios';
import { useContext } from 'react';
import { ChatContext } from '../../utils/ChatContext';
import Cookies from 'js-cookie';

function DropdownContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFriends, setIsOpenFriends] = useState(false);
  const [isOpenForSendMp, setIsOpenForSendMp] = useState(false);
  const [isOpenForAddFriend, setIsOpenForAddFriend] = useState(false);
  const [isOpenForInvite, setIsOpenForInvite] = useState(false);
  const [isOpenForDelete, setIsOpenForDelete] = useState(false);
  const [name, setName] = useState("");
  const [isOpenForBlock, setIsOpenForBlock] = useState(false);

  const toggleFriendsList = () => {
    setIsOpenFriends(!isOpenFriends);
    setIsOpenFriends(!isOpenFriends);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setName(event.target.value);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  const toggleAddFriend = () => {
    setIsOpenForAddFriend(!isOpenForAddFriend);
  };

  const toggleInvite = () => {
    setIsOpenForInvite(!isOpenForInvite);
  };

  const toggleDelete = () => {
    setIsOpenForDelete(!isOpenForDelete);
  };

  const toggleBlock = () => {
    setIsOpenForBlock(!isOpenForBlock);
  };

  const toggleSendMp = () => {
    setIsOpenForSendMp(!isOpenForSendMp);
  };

  return (
    <div className="dropdown-contact">
      <div className="dropdown-contact-toggle" onClick={toggleMenu}>
        Friends
      </div>
      {isOpen && ( /*Friends list  */
        /* du coup map de la liste d'amis et on click sur le le */
        /*utiliser le toggle friends list */
        /* du coup map de la liste d'amis et on click sur le le */
        /*utiliser le toggle friends list */
        <ul className="dropdown-contact-menu">
          <li onClick={toggleAddFriend}>Add friend request</li>
          <li onClick={toggleInvite}>Invite</li>
          <li onClick={toggleDelete}>Delete</li>
          <li onClick={toggleBlock}>Block</li>
          <li onClick={toggleSendMp}>Send Mp</li>
        </ul>
      )}
      {
        isOpenForInvite && (
          <div className="channel-delete-container">
            {/* Add content for channel delete */}
            <input type="text" placeholder="Friend's Name"
            />
            <button onClick={() => { toggleInvite(); }}>ENTER</button>
          </div>
        )
      }
      {
        isOpenForAddFriend && (
          <div className="channel-delete-container">
            {/* Add content for channel delete */}
            <input type="text" placeholder="Friend's Name"
            />
            <button onClick={() => { toggleAddFriend(); }}>ENTER</button>
          </div>
        )
      }
      {
        isOpenForDelete && (
          <div className="channel-delete-container">
            {/* Add content for channel delete */}
            <input type="text" placeholder="Who do you want to delete "
            />
            <button onClick={() => { toggleDelete(); }}>ENTER</button>
          </div>
        )
      }
      {
        isOpenForBlock && (
          <div className="channel-delete-container">
            {/* Add content for channel delete */}
            <input type="text" placeholder="Friend's Name"
            />
            <button onClick={() => { toggleBlock(); }}>ENTER</button>
          </div>
        )
      }
      {
        isOpenForSendMp && (
          <div className="channel-delete-container">
            {/* Add content for channel delete */}
            <input type="text" placeholder="Who do you want to delete "
            />
            <button onClick={() => { toggleDelete(); }}>ENTER</button>
          </div>
        )
      }
    </div>
  );
}

export default DropdownContact;