import React, { useState, useRef } from 'react';

export default function MessageInput({ send }: {
    send: (value: string) => void;
}) {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLDivElement | null>(null);

    const handleInputChange = () => {
        if (inputRef.current) {
            // Use innerText to capture text content with newlines
            setValue(inputRef.current.innerText);
        }
    };

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
        <div className="input-individual-conversation">
            <div
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
        </div>
    );
}
