import React from 'react';
import { useNavigate } from "react-router-dom";

import './ConversationListHeader.css';

import DropdownChannel from '../DropdownChannel/DropdownChannels';
import DropdownContact from '../DropdownContacts/DropdownContact';
import MSN_Messenger from '../../../img/chat/logo_msn_messenger.png';

const ConversationListHeader = ({ name, pfp, user, setConvs, setChannels, setFriends }) => {

    const navigate = useNavigate();

    function goToProfile() {
        window.open(process.env.REACT_APP_LOCAL_F + "/profile");
    }

    return (
        <div className="conversations-list-header">
            <ul className="option-conversation-list" id="option-conversation-bar">
                <DropdownChannel user={user} setChannels={setChannels} setFriends={setFriends} />
                <DropdownContact user={user} setConvs={setConvs} setFriends={setFriends} />
                <li className="option-conversation-option">Actions</li>
                <li className="option-conversation-option">Tools</li>
                <li className="option-conversation-option">Help</li>
            </ul>
            <div className="topbar-conversation-list">
                <div className="profile-pic-messenger">
                    <img className="Your-profile-pic-topbar" src={pfp} alt="profile" onClick={goToProfile} /></div>
                <div className="user-informations">
                    <h2 className="username-info">{name} <span className="status-online">(Online)</span><span className="triangle">▸</span></h2>
                    <h4 className="status-edit">&lt;Type a personal message&gt;<span className="triangle">▸</span></h4>
                </div>
                <img className="logo-msn-messenger" src={MSN_Messenger} alt="messsenger" />
            </div>
        </div>
    );
};

export default ConversationListHeader;
