import React, { useState } from 'react';


import './ConversationListSummary.css';
import regularConv from '../../../img/chat/regular-conv-icon.jpg';
import groupConv from '../../../img/chat/group-conv.jpg';


const ConversationList = ({name, isVisible, pfp}) => {

    const [visibleItems, setVisibleItems] = useState<boolean[]>([false, false, false, false]);
    
    const toggleConvSummary = (index: number) => {
        const newVisibleItems = [...visibleItems];
        newVisibleItems[index] = !newVisibleItems[index];
        setVisibleItems(newVisibleItems);
    };
    return (
        <div className="conversation-list">
            <div className="display-list-convo">
                {/* Content for the conversation list */}
                <ul>
                    <li onClick={() => toggleConvSummary(0)}><img src={regularConv} alt="regularConv" id="chat_regularConv" />je suis une conv</li>
                    <li onClick={() => toggleConvSummary(1)}><img src={regularConv} alt="regularConv" id="chat_regularConv" />je suis un channel</li>
                    <li onClick={() => toggleConvSummary(2)}><img src={groupConv} alt="regularConv" id="chat_regularConv" />je suis une conv de groupe</li>
                    <li onClick={() => toggleConvSummary(3)}><img src={regularConv} alt="regularConv" id="chat_regularConv" />je suis un</li>
                </ul>
                </div>
        </div>
    );
}

export default ConversationList;