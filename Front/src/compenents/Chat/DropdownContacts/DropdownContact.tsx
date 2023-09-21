import React, { useState, useContext, useEffect } from 'react';
import './DropdownContact.css';
import axios from 'axios';
import Cookie from 'js-cookie';
import { ChatContext } from '../../utils/ChatContext';

// import ChatConversationArea from '../ChatConversationArea/ChatConversationArea';
import RedCross from "../../../img/chat/redcross.png"
import Maximize from '../../../img/chat/rsz_1maximize_1.png'
import Minimize from '../../../img/chat/minimized.jpg'

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
    "Authorization": `Bearer ${accessToken}`,
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
      await axios.post(
        `${process.env.REACT_APP_LOCAL_B}/profile/addFriend`,
        { name: friendName },
        { headers }
      )
        .catch(error => {
          if (error.response.status === 401) {
            Cookie.remove('accessToken')
            window.location.href = "/";
          }
        })
      setNotFound(false);
      setIsVisible(true);
      console.log("friendName === " + friendName);
      setFriendName('');
    }
  };

  const handleDeleteFriend = async () => {
    if (friendName) {
      await axios.post(
        `${process.env.REACT_APP_LOCAL_B}/profile/removeFriend`,
        { name: friendName },
        { headers }
      )
        .catch(error => {
          if (error.response.status === 401) {
            Cookie.remove('accessToken')
            window.location.href = "/";
          }
        })
    }
  };


  const handleBlockFriend = async () => {
    if (friendName) {
      await axios.post(
        `${process.env.REACT_APP_LOCAL_B}/profile/addBlocked`,
        { name: friendName },
        { headers }
      )
        .catch(error => {
          if (error.response.status === 401) {
            Cookie.remove('accessToken')
            window.location.href = "/";
          }
        })
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
    await axios.get(
      `${process.env.REACT_APP_LOCAL_B}/profile/getUserByName`,
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        params: {
          username: friendName,
        },
      }
    )
      .then(response => {
        socket?.emit('createConversation', { otherName: response.data.user.name });
      })
      .catch(error => {
        if (error.response.status === 401) {
          Cookie.remove('accessToken')
          window.location.href = "/";
        }
      })
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
      <div className="dropdown-contact-toggle" onClick={toggleMenu}>
        Friends
      </div>
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
            <li className="invite-contact-title">Invite Someone</li>
            <div>
              <img src={Minimize} alt="minimize" id="chat_minimize" />
              <img src={Maximize} alt="Maximize" id="chat_Maximize" />
              <img onClick={() => { toggleInvite(); }} src={RedCross} alt="redcross" id="chat_redcross" />
            </div>
          </ul>
          <h3 className="question">Who do you want to invite ?</h3>
          <div className="contact-invite-form">
            <div className="contact-invite-input">
              <h1>Friend's Name : </h1>
              <input type="text" placeholder="Friend's Name" />
            </div>
          </div>
          <div className="buttons-invite-cancel">
            <button onClick={() => toggleInvite()}>Cancel</button>
            <button onClick={() => toggleInvite()}>Enter</button>
          </div>
        </div>
      )}
      {isOpenForAddFriend && (
        <div className="contact-addfriend-container">
          <ul className="contact-addfriend-navbar">
            <li className="addfriend-contact-title">Add a friend</li>
            <div>
              <img src={Minimize} alt="minimize" id="chat_minimize" />
              <img src={Maximize} alt="Maximize" id="chat_Maximize" />
              <img onClick={() => { toggleAddFriend(); }} src={RedCross} alt="redcross" id="chat_redcross" />
            </div>
          </ul>
          <h3 className="question">Who do you want to addfriend ?</h3>
          <div className="contact-addfriend-form">
            <div className="contact-addfriend-input">
              <h1>Friend's Name : </h1>
              <input type="text" placeholder="Friend's Name"
                value={friendName}
                onChange={handleInputChange} />
            </div>
          </div>
          <div className="buttons-addfriend-cancel">
            <button onClick={() => toggleAddFriend()}>Cancel</button>
            <button onClick={() => { handleAddFriend(); toggleAddFriend(); }}>Enter</button>
          </div>
        </div>
      )}
      {isOpenForDelete && (
        <div className="contact-delete-container">
          <ul className="contact-delete-navbar">
            <li className="delete-contact-title">delete Someone</li>
            <div>
              <img src={Minimize} alt="minimize" id="chat_minimize" />
              <img src={Maximize} alt="Maximize" id="chat_Maximize" />
              <img onClick={() => { toggleDelete(); }} src={RedCross} alt="redcross" id="chat_redcross" />
            </div>
          </ul>
          <h3 className="question">Who do you want to delete ?</h3>
          <div className="contact-delete-form">
            <div className="contact-delete-input">
              <h1>Friend's Name : </h1>
              <input type="text" placeholder="Who do you want to delete"
                value={friendName}
                onChange={handleInputChange} />
            </div>
          </div>
          <div className="buttons-delete-cancel">
            <button onClick={() => toggleDelete()}>Cancel</button>
            <button onClick={() => { handleDeleteFriend(); toggleDelete(); }}>Enter</button>
          </div>
        </div>
      )}
      {isOpenForBlock && (
        <div className="contact-block-container">
          <ul className="contact-block-navbar">
            <li className="block-contact-title">Block Someone</li>
            <div>
              <img src={Minimize} alt="minimize" id="chat_minimize" />
              <img src={Maximize} alt="Maximize" id="chat_Maximize" />
              <img onClick={() => { toggleBlock(); }} src={RedCross} alt="redcross" id="chat_redcross" />
            </div>
          </ul>
          <h3 className="question">Who do you want to block ?</h3>
          <div className="contact-block-form">
            <div className="contact-block-input">
              <h1>Friend's Name : </h1>
              <input type="text" placeholder="Friend's Name"
                value={friendName}
                onChange={handleInputChange} />
            </div>
          </div>
          <div className="buttons-block-cancel">
            <button onClick={() => { handleBlockFriend(); toggleBlock() }}>Enter</button>
            v
          </div>
        </div>
      )}
      {isOpenForSendMp && (
        <div className="contact-sendMp-container">
          <ul className="contact-sendMp-navbar">
            <li className="sendMp-contact-title">sendMp Someone</li>
            <div>
              <img src={Minimize} alt="minimize" id="chat_minimize" />
              <img src={Maximize} alt="Maximize" id="chat_Maximize" />
              <img onClick={() => { toggleSendMp(); }} src={RedCross} alt="redcross" id="chat_redcross" />
            </div>
          </ul>
          <h3 className="question">Who do you want to sendMp ?</h3>
          <div className="contact-sendMp-form">
            <div className="contact-sendMp-input">
              <h1>Friend's Name : </h1>
              <input
                type="text"
                placeholder="Friend's Name"
                value={friendName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="buttons-sendMp-cancel">
            <button onClick={() => toggleSendMp()}>Cancel</button>
            <button onClick={() => { searchUser(); toggleSendMp() }}>Enter</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DropdownContact