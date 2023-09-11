import React, { useState, useRef } from 'react';
import './MessageInput.css'
export default function MessageInput({ send, messages }: {
    send: (value: string) => void;
    messages: string[];
}) {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLSpanElement | null>(null);

    const handleInputChange = () => {
        if (inputRef.current) {
            setValue(inputRef.current.innerText);
        }
    };

    const handleSendMessage = () => {
        if (value.trim() !== '') {
            send(value);
            setValue('');
            if (inputRef.current) {
                inputRef.current.innerText = ''; // Clear the content of the span
            }
        }
    };

    // Handle pressing Enter key to create new lines
    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent adding a new line
            handleSendMessage();
        }
    };

    return (
        <div className="input-individual-conversation">
            <span
                ref={inputRef}
                className="text-area-indiv"
                role="textbox"
                contentEditable
                onInput={handleInputChange}
                onBlur={handleInputChange}
                onKeyDown={handleKeyDown}
                style={{ whiteSpace: 'pre-wrap' }} // Enable line breaks
            />
            <button onClick={handleSendMessage}>Send</button>
            {/* Render the list of messages using the Message component */}
        </div>
    );
}
