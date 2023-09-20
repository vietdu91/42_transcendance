import React, { useState, useEffect } from 'react';
// import Cookie from 'js-cookie';
// import axios from 'axios';

import './ConversationListSummary.css';
import Advertisement1 from './../../../img/chat/thicker.jpg';
import Advertisement2 from './../../../img/chat/thicker.jpg';
import ChatConversationArea from '../ChatConversationArea/ChatConversationArea';
import Channel from '../Channels/Channels';
import regularConv from '../../../img/chat/solo-conv.png';
import groupConv from '../../../img/chat/group-conv.png';
// import groups from '../../../img/chat/group-channel-icon.png'
import friends from '../../../img/chat/groups3d.png'
import SearchBar from '../../searchBar/searchBar';
// import Conversation from "../socketChat"
// import User from "../socketChat"

const ConversationListSummary = ({ name, pfp, indivConv, handleVisibility, channels, convs, user }) => {

    const friendsData = [
        {
            id: 0,
            imageSrc: friends,
            altText: "friends",
            text: "Friends Name 0"
        },
    ];
    
    const [visibleItems, setVisibleItems] = useState<boolean[]>(Array.from({ length: convs.length }, () => false));
    const [visibleChannels, setVisibleChannels] = useState<boolean[]>(Array.from({ length: channels.length }, () => false));
    const [channelsConv, setChannelsConv] = useState(false);
    const [listFriends, setListFriends] = useState(false);

    const toggleConvSummary = (index: number) => {
        const newVisibleItems = [...visibleItems];
        newVisibleItems[index] = !newVisibleItems[index];
        setVisibleItems(newVisibleItems);
    };

    const toggleChannelSummary = (index: number) => {
        const newVisibleChannels = [...visibleChannels];
        newVisibleChannels[index] = !newVisibleChannels[index];
        setVisibleChannels(newVisibleChannels);
    };

    const handleImageClick = () => {
        handleVisibility(true);
        setChannelsConv(false);
        setListFriends(false);
    };

    const handleImageClickChannels = () => {
        setChannelsConv(true);
        handleVisibility(false);
        setListFriends(false);
    };

    const handleImageClickListFriends = () => {
        setListFriends(true);
        handleVisibility(false);
        setChannelsConv(false);
    };

    const handleSearch = (query: string) => {
        console.log(`Recherche en cours avec la requête : ${query}`);
    };

    /* modif benda */
    // const handleIndivConvVisibility = (visibility) => {
    //     handleVisibility(visibility);
    // };
    /* modif benda */
    

    useEffect(() => {
        setVisibleItems(Array.from({ length: convs.length }, () => false));
        setVisibleChannels(Array.from({ length: convs.length }, () => false));
    }, [setVisibleItems, setVisibleChannels, convs.length]);

    return (
        <div className="conversation-list-summary">

            <div className="info-conversation-list">
                <ul>
                    <li><img src={regularConv} alt="regularConv" id="chat_regularConv" onClick={handleImageClick} /></li>
                    <li><img src={groupConv} alt="regularConv" id="chat_regularConv" onClick={handleImageClickChannels} /></li>
                    <li><img src={friends} alt="friends" id="chat_friends" onClick={handleImageClickListFriends} /></li>
                </ul>
                <SearchBar onSearch={handleSearch}></SearchBar>
            </div>
            <div className="display-list-convo">
                {indivConv && (
                    <ul>
                        {convs.map((item, index) => (
                            <li key={item.id} onClick={() => toggleConvSummary(index)}>
                                <img src={regularConv} alt={regularConv} id={"icon-conv"} />
                                {name === item.names[0] ? item.names[1] : item.names[0]} (nickname)
                            </li>
                        ))}
                    </ul>
                )
                }
                {channelsConv && (
                    <ul>
                        {channels.map((item, index) => (
                            <li key={item.id} onClick={() => { console.log(item); toggleChannelSummary(index) }}>
                            <img src={groupConv} alt="regularConv" id="chat_regularConv" onClick={handleImageClickChannels} />
                                {item.name}
                            </li>
                        ))}
                        <li>
                        </li>
                    </ul>
                )
                }
                {listFriends && (
                    <ul>
                        {friendsData.map((item) => (
                            <li key={item.id} onClick={() => toggleConvSummary(item.id)}>
                                <img src={item.imageSrc} alt={item.altText} id={`chat_${item.altText}`} />
                                {item.text}
                            </li>
                        ))}
                    </ul>
                )
                }
            </div>
            <div className="advertisement-scope">
                <div className="advertisement">
                    <img src={Advertisement1} alt="advertisement" id="chat_advertisement" />
                </div>
                <div className="advertisement">
                    <img src={Advertisement2} alt="advertisement" id="chat_advertisement" />
                </div>
            </div>
            {visibleItems.map((isVisible, index) => (
                convs[index] && <ChatConversationArea
                    user={user}
                    conv={convs[index]}
                    isVisible={isVisible}
                />
            ))}
            {visibleChannels.map((isVisible, index) => (
                channels[index] && <Channel key={index} i={index} max={channels.length} user={user} channel={channels[index]} isVisible={isVisible} />
            ))}
        </div>
    );
}

export default ConversationListSummary;
