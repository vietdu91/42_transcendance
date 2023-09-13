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
  const [name, setName] = useState<string>('');
  const socket = useContext(ChatContext);


  const toggleFriendsList = () => {
    setIsOpenFriends(!isOpenFriends);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setName(event.target.value);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  const toggleSendMp = async () => {
    const response = await axios.post(process.env.REACT_APP_LOCAL_B + '/profile/searchUser', { name: name }, { withCredentials: true })
    .then((response) => {
      console.log("id === " + response.data.id);
      const receivId = response.data.id;
    }
    )
    .catch((error) => {
      console.log(error);
      // Gérer les erreurs de requête
    });
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
        <ul className="dropdown-contact-menu">
          <li>Add</li>
          <li>Invite</li>
          <li>Delete</li>
          <li>Block</li>
          <li onClick={toggleSendMp}>Send Mp</li>
        </ul>
      )}
      {
        isOpenForSendMp && (
          <div className="channel-delete-container">
            {/* Add content for channel delete */}
            <input type="text" placeholder="Name"
             onChange={handleInputChange}
            />
            <button onClick={() => {toggleSendMp()}}>ENTER</button>
          </div>
        )
      }
    </div>
  );
}

export default DropdownContact;