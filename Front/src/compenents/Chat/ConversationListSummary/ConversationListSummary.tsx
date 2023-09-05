import React, { useState } from 'react';
import './ConversationListSummary.css';
import Advertisement from './../../../img/chat/advertisement.jpg';
import ChatConversationArea from '../ChatConversationArea/ChatConversationArea';
import Channel from '../Channels/Channels';

// ... (import statements)

const ConversationListSummary = ({name, pfp}) => {
    const [visibleItems, setVisibleItems] = useState<boolean[]>([false, false, false, false]);

    const toggleConvSummary = (index: number) => {
        const newVisibleItems = [...visibleItems];
        newVisibleItems[index] = !newVisibleItems[index];
        setVisibleItems(newVisibleItems);
    };

    return (
        <div className="conversation-list-summary">
            <div className="info-conversation-list">
                {/* Content for the conversation info */}
            </div>
            <div className="display-list-convo">
                {/* Content for the conversation list */}
                <ul>
                    <li onClick={() => toggleConvSummary(0)}>je suis une conv</li>
                    <li onClick={() => toggleConvSummary(1)}>je suis un channel</li>
                    <li onClick={() => toggleConvSummary(2)}>je suis une ju</li>
                    <li onClick={() => toggleConvSummary(3)}>je suis un</li>
                </ul>
            </div>
            <div className="advertisement-scope">
                <div className="advertisement">
                    <img src={Advertisement} alt="advertisement" id="chat_advertisement" />
                </div>
            </div>
            {/* Render conversation summaries based on visibility */}
            {visibleItems.map((isVisible, index) => (
                <ChatConversationArea  name={name} isVisible={isVisible} pfp={pfp} />
            ))}
            <Channel />
        </div>
    );
}

export default ConversationListSummary;
