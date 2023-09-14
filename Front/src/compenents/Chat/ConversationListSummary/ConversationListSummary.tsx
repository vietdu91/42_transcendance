import React, { useState } from 'react';
import './ConversationListSummary.css';
import Advertisement from './../../../img/chat/thicker.jpg';
import ChatConversationArea from '../ChatConversationArea/ChatConversationArea';
import Channel from '../Channels/Channels';
import regularConv from '../../../img/chat/regular-conv-icon.jpg';
import groupConv from '../../../img/chat/group-conv.jpg';
import groups from '../../../img/chat/group-channel-icon.png'
import friends from '../../../img/chat/groups3d.jpg'
import SearchBar from '../../searchBar/searchBar';


const ConversationListSummary = ({ name, pfp }) => {
    const [visibleItems, setVisibleItems] = useState<boolean[]>([false, false, false, false]);
    const [indivConv, setindivConv] = useState(false);
    const [channelsConv, setChannelsConv] = useState(false);
    const [listFriends, setListFriends] = useState(false);

    const toggleConvSummary = (index: number) => {
        const newVisibleItems = [...visibleItems];
        newVisibleItems[index] = !newVisibleItems[index];
        setVisibleItems(newVisibleItems);
    };
    const handleImageClick = () => {
        setindivConv(true);
        setChannelsConv(false); // Turn off the channelsConv
        setListFriends(false); // Turn off the listFriends
    };
    
    const handleImageClickChannels = () => {
        setChannelsConv(true);
        setindivConv(false); // Turn off the indivConv
        setListFriends(false); // Turn off the listFriends
    };
    
    const handleImageClickListFriends = () => {
        setListFriends(true);
        setindivConv(false); // Turn off the indivConv
        setChannelsConv(false); // Turn off the channelsConv
    };


    const handleSearch = (query: string) => {
        // Effectuez votre logique de recherche ici avec la valeur 'query'
        console.log(`Recherche en cours avec la requête : ${query}`);
    };

    return (
        <div className="conversation-list-summary">

            <div className="info-conversation-list">
                <ul>
                    <li><img src={regularConv} alt="regularConv" id="chat_regularConv" onClick={handleImageClick} /></li>
                    <li><img src={groupConv} alt="regularConv" id="chat_regularConv" onClick={handleImageClickChannels}/></li>
                    <li><img src={friends} alt="friends" id="chat_friends" onClick={handleImageClickListFriends}/></li>
                </ul>
                <SearchBar onSearch={handleSearch}></SearchBar>
            </div>

            <div className="display-list-convo">
                {/* Content for the conversation list */}
                {indivConv && (
                    <ul>
                        <li onClick={() => toggleConvSummary(0)}><img src={regularConv} alt="regularConv" id="chat_regularConv" />je suis une conv</li>
                        <li onClick={() => toggleConvSummary(1)}><img src={regularConv} alt="regularConv" id="chat_regularConv" />je suis une conv</li>
                        <li onClick={() => toggleConvSummary(2)}><img src={groupConv} alt="regularConv" id="chat_regularConv" />je suis une conv</li>
                        <li onClick={() => toggleConvSummary(3)}><img src={regularConv} alt="regularConv" id="chat_regularConv" />je suis une conv</li>
                    </ul>
                )
                }
                {channelsConv && (
                    <ul>
                        <li onClick={() => toggleConvSummary(0)}><img src={regularConv} alt="regularConv" id="chat_regularConv" />je suis un channel</li>
                        <li onClick={() => toggleConvSummary(1)}><img src={regularConv} alt="regularConv" id="chat_regularConv" />je suis un channel</li>
                        <li onClick={() => toggleConvSummary(2)}><img src={regularConv} alt="regularConv" id="chat_regularConv" />je suis un channel</li>
                        <li onClick={() => toggleConvSummary(3)}><img src={regularConv} alt="regularConv" id="chat_regularConv" />je suis un channel</li>
                    </ul>
                )
                }
                {listFriends && (
                    <ul>
                        <li onClick={() => toggleConvSummary(0)}><img src={friends} alt="friends" id="chat_friends" />{"friends name"}</li>
                        <li onClick={() => toggleConvSummary(1)}><img src={friends} alt="friends" id="chat_friends" />{"friends name"}</li>
                        <li onClick={() => toggleConvSummary(2)}><img src={friends} alt="friends" id="chat_friends" />{"friends name"}</li>
                        <li onClick={() => toggleConvSummary(3)}><img src={friends} alt="friends" id="chat_friends" />{"friends name"}</li>
                    </ul>
                )
                }
            </div>
            <div className="advertisement-scope">
                <div className="advertisement">
                    <img src={Advertisement} alt="advertisement" id="chat_advertisement" />
                </div>
            </div>
            {/* Render conversation summaries based on visibility */}
            {visibleItems.map((isVisible, index) => (
                <ChatConversationArea name={name} isVisible={isVisible} pfp={pfp} />
            ))}
            <Channel />
        </div>
    );
}

export default ConversationListSummary;
