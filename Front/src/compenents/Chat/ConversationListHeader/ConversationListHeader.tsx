import React from 'react';
// import { useContext } from 'react';
// import Cookies from 'js-cookie';
// import { ChatContext } from '../../utils/ChatContext';
import { useNavigate } from "react-router-dom";


import './ConversationListHeader.css';
import DropdownChannel from '../DropdownChannel/DropdownChannels';
import DropdownContact from '../DropdownContacts/DropdownContact';
import Logo from '../../../img/chat/group-conv.png';
import MSN_Messenger from '../../../img/chat/logo_msn_messenger.png';

// interface ConversationListHeaderProps {
//     name: string;
//     pfp: string;
//     handleVisibility: (visibility: any) => void;
//     isConvListVisible: boolean;
//     setIsConvListVisible: React.Dispatch<React.SetStateAction<boolean>>;
//     addConversation: (newConversation: string) => void;
// }

// const ConversationListHeader: React.FC<ConversationListHeaderProps> = ({
//     name,
//     pfp,
//     handleVisibility,
//     addConversation,
//     isConvListVisible,
//     setIsConvListVisible,
// }) => {


const ConversationListHeader = ({ name, pfp, user, setConvs, setChannels, setFriends }) => {
    // État pour définir si la room est privée

    // const socket = useContext(ChatContext);
    const navigate = useNavigate();

    function goToProfile() {
        window.open(process.env.REACT_APP_LOCAL_F + "/profile");
    }

    return (
        <div className="conversations-list-header">
            <ul className="top-conversation-list">
                <li className="icon-messenger"><img src={Logo} alt="logo" id="logo" /></li>
                <li className="transcendance-messenger">Transcendence Messenger</li>
                <div className="clh-right-icons">
                    <li><button className="chat-icons-messenger" aria-label="Minimize"></button></li>
                    <li><button className="chat-icons-messenger" aria-label="Maximize"></button></li>
                    <li><button className="chat-icons-messenger" aria-label="Close" onClick={() => navigate("/")}></button></li>
                </div>
            </ul>
            {/* <hr /> */}
            <ul className="option-conversation-list" id="option-conversation-bar">
                {/* <li onClick={() => showContact("First")}></li> */}
                <DropdownChannel user={user} setChannels={setChannels} setFriends={setFriends} />
                <DropdownContact user={user} setConvs={setConvs} setFriends={setFriends} />
                <li className="option-conversation-option">Actions</li>
                <li className="option-conversation-option">Tools</li> 
                <li className="option-conversation-option">Help</li>
            </ul>
        <div className="topbar-conversation-list">
            <div className="profile-pic-messenger">
                <img className="Your-profile-pic-topbar" src={pfp} alt="profile" onClick={goToProfile}/></div>                
                <div className="user-informations">
                    <h2 className="username-info">{name} <span className="status-online">(Online)</span><span className="triangle">▾</span></h2>
                    <h4 className="status-edit">&lt;Type a personal message&gt;<span className="triangle">▾</span></h4>
                </div>
                <img className="logo-msn-messenger" src={MSN_Messenger} alt="messsenger"/>
            </div>
        </div>
    );
};

export default ConversationListHeader;
