import React from 'react';
import './ConversationListSummary.css';
import Advertisement from './../../../img/chat/advertisement.jpg'

const ConversationListSummary = () => {
    return (
        <div className="conversation-list-summary">
            <div className="info-conversation-list">
                click here to learn about
            </div>
            <div className="display-list-convo">
                {/* Content for the conversation list */}
            </div>
            <div className="advertisement-scope">
                <div className="advertisement">
                    <img src={Advertisement} alt="advertisement" id="chat_advertisement" />
                </div>
            </div>
        </div>
    );
};

export default ConversationListSummary;