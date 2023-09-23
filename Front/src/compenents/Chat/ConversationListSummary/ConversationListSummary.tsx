import React, { useState, useEffect } from 'react';
import './ConversationListSummary.css';
import Advertisement1 from './../../../img/chat/thicker.jpg';
import Advertisement2 from './../../../img/chat/IMG_3240.png';
import ChatConversationArea from '../ChatConversationArea/ChatConversationArea';
import Channel from '../Channels/Channels';
import regularConv from '../../../img/chat/solo-conv.png';
import groupConv from '../../../img/chat/group-conv.png';
import offlineImg from '../../../img/chat/msn-offline.png'
import onlineImg from '../../../img/chat/solo-conv.png'
import ingameImg from '../../../img/chat/msn-red.png'
import SearchBar from '../../searchBar/searchBar';

const ConversationListSummary = ({ name, indivConv, handleVisibility, channels, convs, friends, user, blocked }) => {
    
    const [visibleItems, setVisibleItems] = useState<boolean[]>(Array.from({ length: convs.length }, () => false));
    const [visibleChannels, setVisibleChannels] = useState<boolean[]>(Array.from({ length: channels.length }, () => false));
    const [channelsConv, setChannelsConv] = useState(false);
    const [listFriends, setListFriends] = useState(false);

    const [visibleConversations, setVisibleConversations] = useState(false);
    const [visibleTriangleChannels, setVisibleTriangleChannels] = useState(false);

    function goToProfile(name: string) {
		window.open(`` + process.env.REACT_APP_LOCAL_F + `/user/${name}`);
	}

    function imageState(state: string) {
        switch(state) {
            case 'OFFLINE': return offlineImg;
            case 'ONLINE': return onlineImg;
            case 'INGAME': return ingameImg;
            default: return offlineImg;
        }
    }

    const toggleConverstions = () => {
        setVisibleConversations(!visibleConversations);
    }

    const toggleChannels = () => {
        setVisibleTriangleChannels(!visibleTriangleChannels);
    }
    
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
    };
    

    useEffect(() => {
        setVisibleItems(Array.from({ length: convs.length }, () => false));
        setVisibleChannels(Array.from({ length: convs.length }, () => false));
    }, [setVisibleItems, setVisibleChannels, convs.length]);

    return (
        <div className="conversation-list-summary">
            <div className="info-conversation-list">
                <ul>
                    <li><img src={regularConv} alt="regularConv" className="chat_regularConv2" onClick={handleImageClick} /></li>
                    <li><img src={groupConv} alt="regularConv" className="chat_regularConv" onClick={handleImageClickChannels} /></li>
                    <li><img src={onlineImg} alt="friends" className="chat_regularConv2" onClick={handleImageClickListFriends} /></li>
                </ul>
                <SearchBar onSearch={handleSearch}></SearchBar>
            </div>
            <div className="display-list-convo">
            {indivConv && <ul className="channel-ul-convo">
                    {visibleConversations && (<span className="triangle-list" onClick={toggleConverstions}>▾ Conversations :</span>)}
                    {!visibleConversations && (<span className="triangle-list" onClick={toggleConverstions}>▸ Conversations :</span>)}
                    {visibleConversations && (
                        convs.map((item, index) => (
                            <li className="channel-li-convo" key={index} onClick={() => toggleConvSummary(index)}>
                                <img src={regularConv} alt={regularConv} id={"icon-conv-img"} />
                                {name === item.names[0] ? item.names[1] : item.names[0]}
                            </li>
                        ))
                        )}
                 </ul>}
            {channelsConv && <ul className="channel-ul-convo">
               {visibleTriangleChannels && (<span className="triangle-list" onClick={toggleChannels}>▾ Channels:</span>)}
               {!visibleTriangleChannels && (<span className="triangle-list" onClick={toggleChannels}>▸ Channels:</span>)}
               {visibleTriangleChannels && (
                   channels.map((item, index) => (
                    <li className="channel-li-convo" key={index} onClick={() => toggleChannelSummary(index)}>
                    <img src={groupConv} alt="regularConv" id="icon-channels-img" onClick={handleImageClickChannels} />
                        {item.name}
                    </li>
                   ))
                   )}
            </ul>}
                {listFriends && (
                    <ul className="channel-ul-convo"> Your Friends :
                        {friends.map((item, index) => (
                            <li className="channel-li-convo" key={index} onClick={() => goToProfile(item.name)}>
                                <img src={imageState(item.state)} alt="state_img" id="icon-friends" />
                                {item.name} ({item.nickname})
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
                    blocked={blocked}
                />
            ))}
            {visibleChannels.map((isVisible, index) => (
                channels[index] && <Channel key={index} user={user} channel={channels[index]} isVisible={isVisible} blocked={blocked} />
            ))}
        </div>
    );
}

export default ConversationListSummary;
