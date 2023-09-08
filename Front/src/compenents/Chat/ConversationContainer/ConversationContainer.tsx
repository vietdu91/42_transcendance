import React from 'react';
import './ConversationContainer.css'; // Import your CSS styles

type ConversationContainerProps = {
    messages: string[]; // Define the messages prop
  };

const ConversationContainer: React.FC<ConversationContainerProps> = ({ messages }) => {
    return (
        <div className="conversation-container">
            <div className="display-individual-convo">
                <div className="Navbar-individual-convo">
                    <div className="to-who">To: Name and userid.transcendance.net</div>
                    <div className="receiver-status">This guy is online if he doesn't answer ask youself the right questions</div>
                    <div className="text-already-sent">
                        <div>
                            {messages?.map((message, index) => (
                                <div key={index}>{message}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="profile-pic-reveiver-container">
                <div className="profile-pic-receiver">
                    {/* You can add content or image for the profile picture here */}
                </div>
            </div>
        </div>
    );
};

export default ConversationContainer;
