import React, { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';

import './ConversationListSummary.css';
import Advertisement from './../../../img/chat/thicker.jpg';
import ChatConversationArea from '../ChatConversationArea/ChatConversationArea';
import Channel from '../Channels/Channels';
import regularConv from '../../../img/chat/solo-conv.png';
import groupConv from '../../../img/chat/group-conv.png';
import groups from '../../../img/chat/group-channel-icon.png'
import friendsImg from '../../../img/chat/groups3d.png'
import SearchBar from '../../searchBar/searchBar';
import Conversation from "../socketChat"
import User from "../socketChat"

const ConversationListSummary = ({ name, pfp, indivConv, handleVisibility, channels, convs, friends, user }) => {

    const friendsData = [
        {
            id: 0,
            imageSrc: friendsImg,
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

    {/* modif benda */ }
    const handleIndivConvVisibility = (visibility) => {
        handleVisibility(visibility);
    };
    {/* modif benda */ }
    

    useEffect(() => {
        setVisibleItems(Array.from({ length: convs.length }, () => false));
        setVisibleChannels(Array.from({ length: convs.length }, () => false));
    }, [setVisibleItems, setVisibleChannels]);

    return (
        <div className="conversation-list-summary">

            <div className="info-conversation-list">
                <ul>
                    <li><img src={regularConv} alt="regularConv" id="chat_regularConv" onClick={handleImageClick} /></li>
                    <li><img src={groupConv} alt="regularConv" id="chat_regularConv" onClick={handleImageClickChannels} /></li>
                    <li><img src={friendsImg} alt="friends" id="chat_friends" onClick={handleImageClickListFriends} /></li>
                </ul>
                <SearchBar onSearch={handleSearch}></SearchBar>
            </div>
            <div className="display-list-convo">
                {indivConv && (
                    <ul>
                        {convs.map((item, index) => (
                            <li key={item.id} onClick={() => toggleConvSummary(index)}>
                                <img src={regularConv} alt={regularConv} id={"icon-conv"} />
                                {name === item.names[0] ? item.names[1] : item.names[0]}
                            </li>
                        ))}
                    </ul>
                )
                }
                {channelsConv && (
                    <ul>
                        {channels.map((item, index) => (
                            <li key={item.id} onClick={() => toggleChannelSummary(index)}>
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
                        {friends.map((item, index) => (
                            <li key={item.id} onClick={() => toggleConvSummary(index)}>
                                <img src={friendsImg} alt={item.altText} id={`chat_${item.altText}`} />
                                {item.name} ({item.nickname})
                            </li>
                        ))}
                    </ul>
                )
                }
            </div>
            <div className="advertisement-scope">
                <div className="advertisement">
                    <img src={Advertisement} alt="advertisement" id="chat_advertisement" />
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
