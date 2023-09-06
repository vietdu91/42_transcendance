import React from 'react';
import './ChatConversationArea.css'; // Import your CSS styles
import ConversationContainer from '../ConversationContainer/ConversationContainer'; // Import the ConversationContainer component
import TextComposerContainer from '../TextComposerContainer/TextComposerContainer'; // Import the TextComposerContainer component

type ChatConversationAreaProps = {
  name: string;
  isVisible: boolean;
  pfp: any; // Add the `pfp` prop with the appropriate type
};

function ChatConversationArea({ name, isVisible, pfp }: ChatConversationAreaProps) {
  return (
    <div className={`chat-conversation-area ${isVisible ? 'visible' : 'hidden'}`}>
      {isVisible && (
        <div className="individual-convo-main-container">
          <div className="navbar-conv">
            {/* Content for the navbar */}
          </div>
          <ConversationContainer />
          <TextComposerContainer name={name} pfp={pfp} />
        </div>
      )}
    </div>
  );
}

export default ChatConversationArea;
