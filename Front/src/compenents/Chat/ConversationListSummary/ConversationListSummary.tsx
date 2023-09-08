import React, { useState } from 'react';
import './ConversationListSummary.css';
import Advertisement from './../../../img/chat/advertisement.jpg';
import ChatConversationArea from '../ChatConversationArea/ChatConversationArea';
import Channel from '../Channels/Channels';
import regularConv from '../../../img/chat/regular-conv-icon.jpg';
import groupConv from '../../../img/chat/group-conv.jpg';

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
                    <li onClick={() => toggleConvSummary(0)}><img src={regularConv} alt="regularConv" id="chat_regularConv" />je suis une conv</li>
                    <li onClick={() => toggleConvSummary(1)}><img src={regularConv} alt="regularConv" id="chat_regularConv" />je suis un channel</li>
                    <li onClick={() => toggleConvSummary(2)}><img src={groupConv} alt="regularConv" id="chat_regularConv" />je suis une conv de groupe</li>
                    <li onClick={() => toggleConvSummary(3)}><img src={regularConv} alt="regularConv" id="chat_regularConv" />je suis un</li>
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
