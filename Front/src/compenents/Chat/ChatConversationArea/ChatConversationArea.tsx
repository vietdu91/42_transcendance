import React from 'react';
import './ChatConversationArea.css'; // Import your CSS styles
import ConversationContainer from '../ConversationContainer/ConversationContainer'; // Import the ConversationContainer component
import TextComposerContainer from '../TextComposerContainer/TextComposerContainer'; // Import the TextComposerContainer component

const ChatConversationArea = ({ name }) => {
    return (
        <div className="chat-conversation-area">
            <div className="individual-convo-main-container">
                <div className="navbar-conv">
                    {/* Content for the navbar */}
                </div>
                <ConversationContainer />
                <TextComposerContainer  name={name}/>
            </div>
        </div>
    );
};

export default ChatConversationArea;
