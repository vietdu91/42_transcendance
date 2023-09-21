import React, { useState, useEffect } from 'react';

// import Cookie from 'js-cookie';
// import axios from 'axios';

import './ConversationListSummary.css';
import Advertisement1 from './../../../img/chat/thicker.jpg';
import Advertisement2 from './../../../img/chat/IMG_3240.png';
import ChatConversationArea from '../ChatConversationArea/ChatConversationArea';
import Channel from '../Channels/Channels';
import regularConv from '../../../img/chat/solo-conv.png';
import groupConv from '../../../img/chat/group-conv.png';
import groups from '../../../img/chat/group-channel-icon.png'
import offlineImg from '../../../img/chat/solo-conv.png'
import onlineImg from '../../../img/chat/groups3d.png'
import ingameImg from '../../../img/chat/group-conv.png'
import SearchBar from '../../searchBar/searchBar';
// import Conversation from "../socketChat"
// import User from "../socketChat"

const ConversationListSummary = ({ name, pfp, indivConv, handleVisibility, channels, convs, friends, user }) => {
    
    const [visibleItems, setVisibleItems] = useState<boolean[]>(Array.from({ length: convs.length }, () => false));
    const [visibleChannels, setVisibleChannels] = useState<boolean[]>(Array.from({ length: channels.length }, () => false));
    const [channelsConv, setChannelsConv] = useState(false);
    const [listFriends, setListFriends] = useState(false);
    const [clicked, setClicked] = useState(false);

    function goToProfile(name: string) {
		window.open(`` + process.env.REACT_APP_LOCAL_F + `/user/${name}`);
	}

    function imageState(state: string) {
        switch(state) {
            case 'OFFLINE': return offlineImg;break;
            case 'ONLINE': return onlineImg;break;
            case 'INGAME': return ingameImg;break;
            default: return offlineImg;
        }
    }

    const toggleConvSummary = (index: number) => {
        setClicked(!clicked);
        const newVisibleItems = [...visibleItems];
        newVisibleItems[index] = !newVisibleItems[index];
        setVisibleItems(newVisibleItems);
    };

    const toggleChannelSummary = (index: number) => {
        setClicked(!clicked);
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
                    <li><img src={onlineImg} alt="friends" id="chat_friends" onClick={handleImageClickListFriends} /></li>
                </ul>
                <SearchBar onSearch={handleSearch}></SearchBar>
            </div>
            <div className="display-list-convo">
                {indivConv && (
                    <ul className="channel-ul-convo"> Conversations :
                        {convs.map((item, index) => (
                            <li className="channel-li-convo" key={item.id} onClick={() => toggleConvSummary(index)}>
                                <img src={regularConv} alt={regularConv} id={"icon-conv-img"} />
                                {name === item.names[0] ? item.names[1] : item.names[0]}
                            </li>
                        ))}
                    </ul>
                )
                }
                {channelsConv && (
                    <ul className="channel-ul-channels"> Channels : 
                        {channels.map((item, index) => (
                            <li className="channel-li-channels" key={item.id} onClick={() => toggleChannelSummary(index)}>
                            <img src={groupConv} alt="regularConv" id="icon-channels-img" onClick={handleImageClickChannels} />
                                {item.name}
                            </li>
                        ))}
                        <li>
                        </li>
                    </ul>
                )
                }
                {listFriends && (
                    <ul className="channel-ul-friend-list"> Your Friends :
                        {friends.map((item, index) => (
                            <li className="channel-li-friend-list" key={item.id} onClick={() => goToProfile(item.name)}>
                                <img src={imageState(item.state)} alt={item.altText} id="icon-friends" />
                                {item.name} ({item.nickname})
                                <img src={item.pfp_url}/>
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
                    key={index}
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
