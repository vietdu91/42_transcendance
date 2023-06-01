import React from 'react'
import { useState } from 'react';

export default function MessageInput({
    send,
}: {
    send: (value : string) => void
}) {
    const [value, setValue] = useState("");
    return (
        <>
            <input
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type your message ..." 
            value={value} />
            <button onClick={() => send(value)}>Send</button>
        </>
    )
}