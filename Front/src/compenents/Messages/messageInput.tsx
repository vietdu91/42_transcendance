import React, { useState } from 'react';

export default function MessageInput({ send, messages }: {
    send: (value: string) => void;
    messages: string[]; // Updated prop type to expect an array of strings
}) {
    const [value, setValue] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSendMessage = () => {
        if (value.trim() !== '') {
            send(value);
            setValue(''); // Clear the input field
        }
    };

    return (
        <div className="input-individual-conversation">
            <input
                type="text"
                onChange={handleInputChange}
                placeholder="Type your message ..."
                value={value}
            />
            <button onClick={handleSendMessage}>Send</button>
            {/* Render the list of messages using the Message component */}
            
        </div>
    );
}


{/* J'ai ete modif  */}