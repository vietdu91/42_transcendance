import React, { useState, useContext, useEffect } from 'react';
import './DropdownContact.css';
import axios from 'axios';
import Cookie from 'js-cookie';
import { ChatContext } from '../../utils/ChatContext';

import RedCross from "../../../img/chat/redcross.png"
import Maximize from '../../../img/chat/rsz_1maximize_1.png'
import Minimize from '../../../img/chat/minimized.jpg'
import Logo from '../../../img/chat/group-conv.png'

interface OtherUser {
  name: string,
  nickname: string,
  pfp: string,
  state: number,
}

const initUser: OtherUser = {
  name: "",
  nickname: "",
  pfp: "",
  state: 0,
}

function DropdownContact({ user, setConvs, setFriends }) {
  const socket = useContext(ChatContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFriends, setIsOpenFriends] = useState(false);
  const [isOpenForSendMp, setIsOpenForSendMp] = useState(false);
  const [isOpenForAddFriend, setIsOpenForAddFriend] = useState(false);
  const [isOpenForInvite, setIsOpenForInvite] = useState(false);
  const [isOpenForDelete, setIsOpenForDelete] = useState(false);
  const [isOpenForBlock, setIsOpenForBlock] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [otherUser, setOtherUser] = useState<OtherUser>(initUser)
  const [conv, setConv] = useState()

  const accessToken = Cookie.get('accessToken');

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const toggleFriendsList = () => {
    setIsOpenFriends(!isOpenFriends);
  };

  const handleInputChange = (event) => {
    setFriendName(event.target.value);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleAddFriend = async () => {
    setIsOpenForAddFriend(!isOpenForAddFriend);

  };

  const handleAddFriend = async () => {
    if (friendName) {
      try {

        const response = await axios.post(
          `${process.env.REACT_APP_LOCAL_B}/profile/addFriend`,
          { name: friendName },
          { headers }
        );
        setNotFound(false);
        setIsVisible(true);
        console.log("friendName === " + friendName);
        setFriendName('');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteFriend = async () => {
    if (friendName) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_LOCAL_B}/profile/removeFriend`,
          { name: friendName },
          { headers }
        );
      }
      catch (error) {
        console.error(error);
      }
    }
  };


  const handleBlockFriend = async () => {
    if (friendName) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_LOCAL_B}/profile/addBlocked`,
          { name: friendName },
          { headers }
        );
      }
      catch (error) {
        console.error(error);
      }
    }
  };



  const toggleInvite = () => {
    setIsOpenForInvite(!isOpenForInvite);
  };

  const toggleDelete = async () => {
    setIsOpenForDelete(!isOpenForDelete);
  };

  const toggleBlock = async () => {
    setIsOpenForBlock(!isOpenForBlock);

  };

  const toggleSendMp = () => {
    setIsOpenForSendMp(!isOpenForSendMp);
  };


  const searchUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL_B}/profile/getUserByName`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            username: friendName,
          },
        }
      );

      socket?.emit('createConversation', {otherName: response.data.user.name});
    } catch (error) {
      console.log("You can't create a convesation with yourself");
    }
  };


  useEffect(() => {
    socket.on('conversationCreated', (response) => {
      console.log(response);
      setOtherUser(response.otherUser);
      setConvs(response.conversations);
      // setFriends(response.friends);
    })
  }, []);

  return (
    <div className="dropdown-contact">
      <li className="option-conversation-option" onClick={toggleMenu}>
        Friends
      </li>
      {isOpen && (
        <ul className="dropdown-contact-menu">
          <li onClick={toggleAddFriend}>Add friend request</li>
          <li onClick={toggleInvite}>Invite</li>
          <li onClick={toggleDelete}>Delete</li>
          <li onClick={toggleBlock}>Block</li>
          <li onClick={() => { toggleSendMp() }}>Send Mp</li>
        </ul>
      )}
      {isOpenForInvite && (
        	<div className="contact-invite-container">
            <ul className="contact-invite-navbar">
              <li className="icon-messenger"><img src={Logo} alt="logo" id="logo" /></li>
              <li className="invite-contact-title">Invite Someone</li>
              <div className="ddc-right-icons">
                <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Minimize"></button></li>
                <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Maximize"></button></li>
                <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Close" onClick={() => { toggleInvite(); }}></button></li>
              </div>
            </ul>
            <fieldset className="contact-invite-fieldset">
                <legend className="contact-invite-legend">Who do you want to invite ?</legend>
                <div className="contact-invite-form">
                  <div className="contact-invite-input">
                    <h1 className="question">Friend's Name : </h1>
                    <input className="ze-input"
                      type="text" placeholder="Friend's Name"/>
                  </div>
                </div>
            </fieldset>
            <div className="buttons-invite-cancel">
              <button className="contact-invite-cancel" onClick={() => { toggleInvite() }}>Cancel</button>
              <button className="contact-invite-enter" onClick={() => { toggleInvite() }}>Enter</button>
            </div>
          </div>
      )}
      {isOpenForAddFriend && (
          <div className="contact-addfriend-container">
            <ul className="contact-invite-navbar">
              <li className="icon-messenger"><img src={Logo} alt="logo" id="logo" /></li>
              <li className="invite-contact-title">Add a Friend</li>
              <div className="ddc-right-icons">
                <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Minimize"></button></li>
                <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Maximize"></button></li>
                <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Close" onClick={() => { toggleAddFriend(); }}></button></li>
              </div>
            </ul>
            <fieldset className="contact-invite-fieldset">
                <legend className="contact-invite-legend">Who do you want to add friend ?</legend>
                <div className="contact-invite-form">
                  <div className="contact-invite-input">
                    <h1 className="question">Friend's Name : </h1>
                    <input className="ze-input" value={friendName} onChange={handleInputChange}
                      type="text" placeholder="Friend's Name"/>
                  </div>
                </div>
            </fieldset>
            <div className="buttons-invite-cancel">
              <button className="contact-invite-cancel" onClick={() => { toggleAddFriend() }}>Cancel</button>
              <button className="contact-invite-enter" onClick={() => { handleAddFriend(); toggleAddFriend(); }}>Enter</button>
            </div>
          </div>
      )}
      {isOpenForDelete && (
        <div className="contact-delete-container">
          <ul className="contact-invite-navbar">
            <li className="icon-messenger"><img src={Logo} alt="logo" id="logo" /></li>
            <li className="invite-contact-title">Delete Someone</li>
            <div className="ddc-right-icons">
              <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Minimize"></button></li>
              <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Maximize"></button></li>
              <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Close" onClick={() => { toggleDelete(); }}></button></li>
            </div>
          </ul>
          <fieldset className="contact-invite-fieldset">
              <legend className="contact-invite-legend">Who do you want to delete ?</legend>
              <div className="contact-invite-form">
                <div className="contact-invite-input">
                  <h1 className="question">Friend's Name : </h1>
                  <input className="ze-input" value={friendName} onChange={handleInputChange}
                    type="text" placeholder="Friend's Name"/>
                </div>
              </div>
          </fieldset>
          <div className="buttons-invite-cancel">
            <button className="contact-invite-cancel" onClick={() => { toggleDelete() }}>Cancel</button>
            <button className="contact-invite-enter" onClick={() => { handleDeleteFriend(); toggleDelete(); }}>Enter</button>
          </div>
        </div>
      )}
      {isOpenForBlock && (
        <div className="contact-block-container">
          <ul className="contact-invite-navbar">
            <li className="icon-messenger"><img src={Logo} alt="logo" id="logo" /></li>
            <li className="invite-contact-title">Block Someone</li>
            <div className="ddc-right-icons">
              <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Minimize"></button></li>
              <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Maximize"></button></li>
              <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Close" onClick={() => { toggleBlock(); }}></button></li>
            </div>
          </ul>
          <fieldset className="contact-invite-fieldset">
              <legend className="contact-invite-legend">Who do you want to block ?</legend>
              <div className="contact-invite-form">
                <div className="contact-invite-input">
                  <h1 className="question">Friend's Name : </h1>
                  <input className="ze-input" value={friendName} onChange={handleInputChange}
                    type="text" placeholder="Friend's Name"/>
                </div>
              </div>
          </fieldset>
          <div className="buttons-invite-cancel">
            <button className="contact-invite-cancel" onClick={() => { toggleBlock() }}>Cancel</button>
            <button className="contact-invite-enter" onClick={() => { handleBlockFriend(); toggleBlock(); }}>Enter</button>
          </div>
        </div>
      )}
      {isOpenForSendMp && (
      <div className="contact-sendMp-container">
        <ul className="contact-invite-navbar">
          <li className="icon-messenger"><img src={Logo} alt="logo" id="logo" /></li>
          <li className="invite-contact-title">Send MP to Someone</li>
          <div className="ddc-right-icons">
            <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Minimize"></button></li>
            <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Maximize"></button></li>
            <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Close" onClick={() => { toggleSendMp(); }}></button></li>
          </div>
        </ul>
        <fieldset className="contact-invite-fieldset">
            <legend className="contact-invite-legend">Who do you want to send MP ?</legend>
            <div className="contact-invite-form">
              <div className="contact-invite-input">
                <h1 className="question">Friend's Name : </h1>
                <input className="ze-input" value={friendName} onChange={handleInputChange}
                  type="text" placeholder="Friend's Name"/>
              </div>
            </div>
        </fieldset>
        <div className="buttons-invite-cancel">
          <button className="contact-invite-cancel" onClick={() => { toggleSendMp() }}>Cancel</button>
          <button className="contact-invite-enter" onClick={() => { searchUser(); toggleSendMp() }}>Enter</button>
        </div>
      </div>
      )}
    </div>
  );
}

export default DropdownContact