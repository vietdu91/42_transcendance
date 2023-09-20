import React from 'react';
// import { useContext } from 'react';
// import Cookies from 'js-cookie';
// import { ChatContext } from '../../utils/ChatContext';
// import { useNavigate } from "react-router-dom";


import './ConversationListHeader.css';
import DropdownChannel from '../DropdownChannel/DropdownChannels';
import DropdownContact from '../DropdownContacts/DropdownContact';
import Logo from '../../../img/chat/group-conv.png'

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


const ConversationListHeader = ({name, pfp, user, setConvs, setChannels}) => {
    // État pour définir si la room est privée

    // const socket = useContext(ChatContext);

    function goToProfile() {
        window.open(process.env.REACT_APP_LOCAL_F + "/profile");
    }

    return (
        <div className="conversations-list-header">
            <ul className="top-conversation-list">
                <li className="icon-messenger"><img src={Logo} alt="logo" id="logo" /></li>
                <li className="transcendance-messenger">Transcendence Messenger</li>
                <div className="right-icons">
                    <li><button className="chat-icons-messenger" aria-label="Minimize"></button></li>
                    <li><button className="chat-icons-messenger" aria-label="Maximize"></button></li>
                    <li><button className="chat-icons-messenger" aria-label="Close"></button></li>
                </div>
            </ul>
            {/* <hr /> */}
            <ul className="option-conversation-list">
                {/* <li onClick={() => showContact("First")}></li> */}
                <DropdownChannel user={user} setChannels={setChannels} />
                <DropdownContact user={user} setConvs={setConvs} />
                <li>Actions</li> { /*  */}
                <li>Tools</li> { /* */}
                <li>Help</li>
            </ul>
            <div className="topbar-conversation-list">
                <div className="profile-pic-messenger">
                    <img className="Your-profile-pic-topbar" src={pfp} alt="profile" onClick={goToProfile}/> {/* Add the profile picture */}
                </div>                <div className="user-informations">
                    <h2 className="username-info">{name} <span className="status-online">(online)</span></h2>
                    <h4 className="status-edit">status to Edit</h4>
                </div>
            </div>
        </div>
    );
};

export default ConversationListHeader;
