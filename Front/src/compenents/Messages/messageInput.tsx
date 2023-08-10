import React from 'react'
import { useState } from 'react';
import Message from './message';

export default function MessageInput({ send, messages }: {
    send: (value : string) => void,
    messages: string[]
}) {
    const [value, setValue] = useState("");
    return (
        <>
            <input onChange={(e) => setValue(e.target.value)}
            placeholder="Type your message ..."
            value={value} />
            <button onClick={() => send(value)}>Send</button>
            <Message message={messages}/>
        </>
    )
}
