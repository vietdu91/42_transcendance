import React from 'react';
import './ConversationContainer.css'; // Import your CSS styles

const ConversationContainer = () => {
    return (
        <div className="conversation-container">
            <div className="display-individual-convo">
                <div className="Navbar-individual-convo">
                    <div className="to-who">To: Name and userid.transcendance.net</div>
                    <div className="receiver-status"></div>
                    <div className="text-already-sent">
                        <ul>
                            <li>Hey</li>
                            <li>Ca va</li>
                        </ul>
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
