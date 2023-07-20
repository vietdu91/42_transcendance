import React from 'react'


export default function Message({message}:{message: string[]}) {
    return (
    <div>{
        message?.map((message, index) => (<div key={index}>{message}</div>))}
    </div>
    )
}