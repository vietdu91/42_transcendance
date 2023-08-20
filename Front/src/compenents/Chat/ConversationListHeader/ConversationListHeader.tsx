import React from 'react';
import './ConversationListHeader.css';
import RedCross from '../../../img/chat/redcross.png'
import Maximize from '../../../img/chat/rsz_1maximize_1.png'

const ConversationListHeader = ({ name }) => {
    return (
        <div className="conversations-list-header">
            <ul className="top-conversation-list">
                {/* liste d'images */}
                <li><img src={RedCross} alt="redcross" id="chat_redcross" /></li>
                <li><img src={Maximize} alt="maximize" id="chat_maximize" /></li>
                <li><img src={RedCross} alt="redcross" id="chat_redcross" /></li>
            </ul>
            <ul className="option-conversation-list">
                <li>File</li>
                <li>Contacts</li>
                <li>Actions</li>
                <li>Tools</li>
                <li>Help</li>
            </ul>
            <div className="topbar-conversation-list">
                <div className="profile-pic-messenger"></div>
                <div className="user-informations">
                    <h1 className="username-info">{name}</h1>
                    <h3>online</h3>
                    <p>salam</p>
                </div>
            </div>
        </div>
    );
};

export default ConversationListHeader;
