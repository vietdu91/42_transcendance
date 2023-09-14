import React, { useState, useRef } from 'react';
import './DropdownContact.css';
import { useContext } from 'react';
import ChatConversationArea from '../ChatConversationArea/ChatConversationArea';

function DropdownContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFriends, setIsOpenFriends] = useState(false);
  const [isOpenForSendMp, setIsOpenForSendMp] = useState(false);
  const [isOpenForAddFriend, setIsOpenForAddFriend] = useState(false);
  const [isOpenForInvite, setIsOpenForInvite] = useState(false);
  const [isOpenForDelete, setIsOpenForDelete] = useState(false);
  const [isOpenForBlock, setIsOpenForBlock] = useState(false);

  {/* Integration pop up  */}
  const [messageToSend, setMessageToSend] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');


  const handleSearchUser = () => {
    if (searchQuery.trim() !== '') {
      // Implement your user search logic here, e.g., make an API request
      // and update the user list or take the appropriate action.
      // For now, we'll just log the search query.
      console.log(`Searching for user: ${searchQuery}`);

      // Clear the input field
      setSearchQuery('');
      
      // Close the dropdown
      toggleSendMp(); // You may need to adjust this to match your UI logic.
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchUser();
    }
  };

  const handleConversationSelect = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  const toggleFriendsList = () => {
    setIsOpenFriends(!isOpenFriends);
  }

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
        <ul className="dropdown-contact-menu">
          <li onClick={toggleAddFriend}>Add friend request</li>
          <li onClick={toggleInvite}>Invite</li>
          <li onClick={toggleDelete}>Delete</li>
          <li onClick={toggleBlock}>Block</li>
          <li onClick={() => { toggleSendMp(); handleSearchUser(); }}>Send Mp</li>
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
            <input               type="text"
              placeholder="Search for a user..."
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
              <button onClick={() => handleSearchUser()}>ENTER</button>
          </div>
        )
      }
    </div>
  );
}

export default DropdownContact;