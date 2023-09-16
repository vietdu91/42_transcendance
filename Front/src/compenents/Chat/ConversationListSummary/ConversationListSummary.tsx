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
import friends from '../../../img/chat/groups3d.png'
import SearchBar from '../../searchBar/searchBar';
import Conversation from "../socketChat"
import User from "../socketChat"

const ConversationListSummary = ({ name, pfp, indivConv, handleVisibility,
    isConvListVisible, setIsConvListVisible, convs, user }) => {
    // if (!isConvListVisible)
    //     return null;
    const id = Cookie.get('id');
    const [visibleItems, setVisibleItems] = useState<boolean[]>(Array.from({ length: convs.length }, () => false));
    // const [indivConv, setindivConv] = useState(false);
    const [channelsConv, setChannelsConv] = useState(false);
    const [listFriends, setListFriends] = useState(false);

    const toggleConvSummary = (index: number) => {
        const newVisibleItems = [...visibleItems];
        newVisibleItems[index] = !newVisibleItems[index];
        setVisibleItems(newVisibleItems);
    };

    const handleImageClick = () => {
        handleVisibility(true);
        setChannelsConv(false); // Turn off the channelsConv
        setListFriends(false); // Turn off the listFriends
    };

    const handleImageClickChannels = () => {
        setChannelsConv(true);
        handleVisibility(false); // Turn off the indivConv
        setListFriends(false); // Turn off the listFriends
    };

    const handleImageClickListFriends = () => {
        setListFriends(true);
        handleVisibility(false); // Turn off the indivConv
        setChannelsConv(false); // Turn off the channelsConv
    };

    const handleSearch = (query: string) => {
        // Effectuez votre logique de recherche ici avec la valeur 'query'
        console.log(`Recherche en cours avec la requête : ${query}`);
    };

    {/* modif benda */ }
    const handleIndivConvVisibility = (visibility) => {
        handleVisibility(visibility);
    };
    {/* modif benda */ }

    useEffect(() => {
        setVisibleItems(Array.from({ length: convs.length }, () => false));
    }, [setVisibleItems]);
    
    const channelData = [
        {
            id: 0,
            imageSrc: regularConv,
            altText: "regularConv",
            text: "je suis un channel 0"
        },
        {
            id: 1,
            imageSrc: regularConv,
            altText: "regularConv",
            text: "je suis un channel 1"
        },
        {
            id: 2,
            imageSrc: regularConv,
            altText: "regularConv",
            text: "je suis un channel 2"
        },
        {
            id: 3,
            imageSrc: regularConv,
            altText: "regularConv",
            text: "je suis un channel 3"
        }
    ];

    const friendsData = [
        {
            id: 0,
            imageSrc: friends,
            altText: "friends",
            text: "Friends Name 0"
        },
        {
            id: 1,
            imageSrc: friends,
            altText: "friends",
            text: "Friends Name 1"
        },
        {
            id: 2,
            imageSrc: friends,
            altText: "friends",
            text: "Friends Name 2"
        },
        {
            id: 3,
            imageSrc: friends,
            altText: "friends",
            text: "Friends Name 3"
        }
    ];

    

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
                {/* Content for the conversation list */}
                {indivConv && (
                    <ul>
                        {convs.map((item, index) => (
                            <li key={item.id} onClick={() => toggleConvSummary(index)}>
                                <img src={regularConv} alt={regularConv} id={regularConv} />
                                {name === item.names[0] ? item.names[1] : item.names[0]}
                            </li>
                        ))}
                    </ul>
                )
                }
                {channelsConv && (
                    <ul>
                        {channelData.map((item) => (
                            <li key={item.id} onClick={() => toggleConvSummary(item.id)}>
                                <img src={item.imageSrc} alt={item.altText} id={`chat_${item.altText}`} />
                                {item.text}
                            </li>
                        ))}
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
                    <img src={Advertisement} alt="advertisement" id="chat_advertisement" />
                </div>
            </div>
            {/* Render conversation summaries based on visibility */}
            {visibleItems.map((isVisible, index) => (
                    convs[index] && <ChatConversationArea
                        user={user}
                        conv={convs[index]}
                        isVisible={isVisible}
                    />
            ))}
            <Channel />
        </div>
    );
}

export default ConversationListSummary;
