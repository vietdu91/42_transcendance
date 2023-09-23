import React, { useState, useRef, useContext } from 'react';
import './MessageInput.css'
import { ChatContext } from '../utils/ChatContext';

export default function MessageInput({ send, othername }) {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLDivElement | null>(null);
    const socket = useContext(ChatContext);

    const handleInputChange = () => {
        if (inputRef.current) {
            // Use innerText to capture text content with newlines
            setValue(inputRef.current.innerText);
        }
    };

    const handleWizz = async () => {
        console.log(othername)
        socket.emit('wizz', { othername: othername });
    }

    const handleSendMessage = () => {
        if (value.trim() !== '') {
            // Use the raw value without modification
            send(value);
            setValue('');
            if (inputRef.current) {
                inputRef.current.innerText = ''; // Clear the content of the div
            }
        }
    };

    // Handle pressing Enter key to create new lines
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent adding a new line
            handleSendMessage();
        }
    };

    return (
        <div className="channel-input-text-conv">
            <span className="message-input-channel-up-span-conv"
                ref={inputRef}
                // className="text-area-indiv"
                role="textbox"
                contentEditable
                onInput={handleInputChange}
                onBlur={handleInputChange}
                onKeyDown={handleKeyDown}
                style={{ whiteSpace: 'pre-wrap' }}
            ></span>
            <div className="channel-down-2">
                <button className="channel-down-button" onClick={handleSendMessage}>Send</button>
                <button className="channel-down-button" id="wizz-button" onClick={handleWizz}>🫨</button>
            </div>
        </div>
    );
}
