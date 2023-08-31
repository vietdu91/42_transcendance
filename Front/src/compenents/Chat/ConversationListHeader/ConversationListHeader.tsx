import React from 'react';
import './ConversationListHeader.css';
import RedCross from '../../../img/chat/redcross.png'
import Maximize from '../../../img/chat/rsz_1maximize_1.png'
import { useState, useEffect } from 'react';
import DropdownChannel from '../DropdownChannel/DropdownChannels';
import DropdownContact from '../DropdownContacts/DropdownContact';

const ConversationListHeader = ({ name }) => {
    const [state, setState] = useState({
        name: 'React',
        showHideDemo1: false,
    });

    const hideComponent = (name) => {
        setState((prevState) => ({
            ...prevState,
            [name]: !prevState[name]
        }));
    };

    return (
        <div className="conversations-list-header">
            <ul className="top-conversation-list">
                <li className="transcendance-messenger">Transcendance Messenger</li>
                <div className="right-icons">
                    <li><img src={RedCross} alt="redcross" id="chat_redcross" /></li>
                    <li><img src={Maximize} alt="maximize" id="chat_maximize" /></li>
                    <li><img src={RedCross} alt="redcross" id="chat_redcross" /></li>
                </div>
            </ul>
            <hr />
            <ul className="option-conversation-list">
                {/* <li onClick={() => showContact("First")}></li> */}
                <DropdownChannel />{/*Create Join Delete*/}
                <DropdownContact /> {/* Add Block Delete MP Liste D'amis*/}
                <li>Actions</li> { /*  */}
                <li>Tools</li> { /* */}
                <li>Help</li>
            </ul>
            <div className="topbar-conversation-list">
                <div className="profile-pic-messenger"></div>
                <div className="user-informations">
                    <h2 className="username-info">{name} <span className="status-online">(online)</span></h2>
                    <h4 className="status-edit">status to Edit</h4>
                </div>
            </div>
        </div>
    );
};

export default ConversationListHeader;
