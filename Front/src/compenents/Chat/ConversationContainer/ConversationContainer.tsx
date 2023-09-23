import React, { useRef, useEffect } from 'react';
import './ConversationContainer.css';

const ConversationContainer = ({ name, nickname, otherpfp, messages }) => {

    const divRef = useRef<HTMLDivElement | null>(null);

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
                    <div className="to-who">To: {name} AKA "{nickname}"</div>
                    <div className="receiver-status">This guy is online if he doesn't answer ask youself the right questions</div>
                    <div className="text-already-sent" ref={divRef}>
                        {messages?.map((message, index) => (
                            <ul key={index} >
                                <li className="conv-sender-info">{message.authorName}:</li>
                                <li className="conv-message-content">{message.content}</li>
                                <li className="conv-message-date">{message.createdAt}</li>
                            </ul>
                        ))}
                    </div>
                </div>
            </div>
            <div className="profile-pic-reveiver-container" onClick={() => { goToProfile(name) }}>
                <div className="profile-pic-receiver">
                    <img src={otherpfp} alt={otherpfp} id={otherpfp} />
                    {}
                </div>
                {name}
            </div>
        </div>
    );
};

export default ConversationContainer;
