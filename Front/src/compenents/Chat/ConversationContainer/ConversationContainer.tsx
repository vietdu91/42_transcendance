import React, { useRef, useEffect, useContext, useState } from 'react';
import './ConversationContainer.css'; // Import your CSS styles
import Info from '../../../img/chat/info.png'
import { ChatContext } from '../../utils/ChatContext';
import { useNavigate } from 'react-router-dom'

const ConversationContainer = ({ name, nickname, otherpfp, messages, convId }) => {

    const divRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const socket = useContext(ChatContext);

    const inviteToGame = async () => {
        socket?.emit('sendMessageConv', { value: "Viens jouer ! Clique sur le bouton Games !", convId })
    }
    
    const goPersonalMatchmaking = () => {
        navigate(`/champselect?other=${name}`);
    }

	function ActiveChiottes() {

        const videoUrl = 'https://www.youtube.com/watch?v=ZnDQwmy1dX4';
        window.open(videoUrl, 'Video Window', 'width=800,height=600');
	}


    function goToProfile(name: string) {
        window.open(`` + process.env.REACT_APP_LOCAL_F + `/user/${name}`);
    }

    const scrollToBottom = () => {
        if (divRef.current) {
            divRef.current.scrollTop = divRef.current.scrollHeight;
        }
    };
    scrollToBottom();

    useEffect(() => {
        scrollToBottom();

    }, []);

    return (
        <div className="conversation-container">
            <div className="display-individual-convo">
                <div className="Navbar-individual-convo">
                    <div className="to-who">To: <span className="gras">{name}</span> AKA "{nickname}"</div>
                    <div className="receiver-status">
                        <img alt="info" src={Info} className="convo-channel-info"></img>
                        {name} may not reply because he or she doesn't like you.
                    </div>
                    <div className="text-already-sent" ref={divRef}>
                        {messages.map((message, index) => (
                            <ul key={index}>
                                <li className="conv-sender-info-chan">{message.authorName}</li>
                                <li className="conv-message-content-chan">{message.content}</li>
                                <li className="conv-message-date-chan">{message.createdAt}</li>
                            </ul>
                        ))}
                    </div>
                </div>
            </div>
            <div className="profile-pic-reveiver-container">
                <div className="profile-pic-receiver">
                    <img src={otherpfp} alt={otherpfp} id={otherpfp} />
                </div>
                <div className="channel-infos-user-name" onClick={() => { goToProfile(name) }}>
                    {name} ▸
                </div>
                <div className="channel-down-buttons-3">
                    <button className="channel-down-button-3" onClick={inviteToGame}>Invite 💌</button>
                    <button className="channel-down-button-3" onClick={goPersonalMatchmaking}>Invite Game 🎲</button>
                    <button className="channel-down-button-3" onClick={ActiveChiottes}>Surprise 🚽</button>
                </div>
            </div>
        </div>
    );
};

export default ConversationContainer;
