import React, { useState } from 'react';
import './ConversationListSummary.css';
import Advertisement from './../../../img/chat/advertisement.jpg';
import ChatConversationArea from '../ChatConversationArea/ChatConversationArea';
import Channel from '../Channels/Channels';
import regularConv from '../../../img/chat/regular-conv-icon.jpg';
import groupConv from '../../../img/chat/group-conv.jpg';
import groups from '../../../img/chat/group-channel-icon.png'
import SearchBar from '../../searchBar/searchBar';
import ConversationList from './ConversationList';



const dockConversationListSummary = ({name, pfp }) => {
    const [visibleItems, setVisibleItems] = useState<boolean[]>([false, false, false, false]);

    const toggleConvSummary = (index: number) => {
        const newVisibleItems = [...visibleItems];
        newVisibleItems[index] = !newVisibleItems[index];
        setVisibleItems(newVisibleItems);
    };

    const handleSearch = (query: string) => {
        // Effectuez votre logique de recherche ici avec la valeur 'query'
        console.log(`Recherche en cours avec la requête : ${query}`);
      };

    return (
        <div className="conversation-list-summary">
            <div className="info-conversation-list">
                <ul>
                    <li><img src={regularConv} alt="regularConv" id="chat_regularConv" /></li> 
                    <li><img src={groupConv} alt="regularConv" id="chat_regularConv" /></li> 
                </ul>
                <SearchBar onSearch={handleSearch}></SearchBar>
            </div>
            <ConversationList name={name} isVisible={visibleItems} pfp={pfp} />
            <div className="advertisement-scope">
                <div className="advertisement">
                    <img src={Advertisement} alt="advertisement" id="chat_advertisement" />
                </div>
            </div>
            {/* Render conversation summaries based on visibility */}
            {visibleItems.map((isVisible, index) => (
                <ChatConversationArea  name={name} isVisible={isVisible} pfp={pfp} />
            ))}
            {/* <Channel /> */}
        </div>
    );
}

export default ConversationListSummary;
