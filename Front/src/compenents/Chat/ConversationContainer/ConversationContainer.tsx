import React from 'react';
import './ConversationContainer.css'; // Import your CSS styles

const ConversationContainer = ({ name, nickname, otherpfp, messages }) => {
    return (
        <div className="conversation-container">
            <div className="display-individual-convo">
                <div className="Navbar-individual-convo">
                    <div className="to-who">To: {name} AKA "{nickname}"</div>
                    <div className="receiver-status">This guy is online if he doesn't answer ask youself the right questions</div>
                    <div className="text-already-sent">
                            {messages?.map((message, index) => (
                                <ul key={index}>
                                    <li>{nickname}{message.date}</li>
                                    <li >{message.content}</li>
                                </ul>
                            ))}
                    </div>
                </div>
            </div>
            <div className="profile-pic-reveiver-container">
                <div className="profile-pic-receiver">
                    <img src={otherpfp} alt={otherpfp} id={otherpfp} />
                    {/* You can add content or image for the profile picture here */}
                </div>
                {name}
            </div>
        </div>
    );
};

export default ConversationContainer;
