import React from 'react';

export default function Message({ messages }: { messages: string[] }) {
    return (
        <div>
            {messages?.map((message, index) => (
                <div key={index}>{message}</div>
            ))}
        </div>
    );
}


{/* j'ai ete modif  */}