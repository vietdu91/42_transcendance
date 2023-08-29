import React from 'react';
import { useState, useEffect } from 'react';
import './TextComposerContainer.css'; // Import your CSS styles
// import Wizz from '../../../img/chat/FAcejwHWEAMfcAO.jpeg'
import Wizz from '../../../img/chat/wizz.png'
import MessageInput from '../../Messages/messageInput';
import Cookies from 'js-cookie';
import io , { Socket } from "socket.io-client";


const TextComposerContainer = ({ name }) => {

    const [messages, setMessages] = useState<string[]>([]);
    const [socket, setSocket] = useState<Socket>();


    const send = (value: string) => {
        const id = Cookies.get('id');
        socket?.emit('message', value, id);
    }

    useEffect(() => {
        // console.log('react api ==== ' + process.env.REACT_APP_ENDPOINT);
        const apiEndpoint = process.env.REACT_APP_LOCAL_B;
        const newSocket = io(String(apiEndpoint));
        setSocket(newSocket);
     }, [setSocket]);


     const messageListener = (newMessage: string) => {
        const authorId = Cookies.get('id');

        setMessages(prevMessages => [...prevMessages, newMessage]);
    }

    useEffect(() => {
        socket?.on('message', messageListener);
        return () => {
            socket?.off('message', messageListener);
        }
    }, [messageListener]);

    return (
        <div className="text-composer-container">
            <div className="container-write-text">
                <div className="upper-part-write-text">
                <img src={Wizz} alt="Wizz" />

                    {/* Content for the upper part */}
                </div>
                <div className="middle-part-write-text">
                    {/* Content for the middle part */}
                </div>
                <div className="bottom-part-write-text">
                    <MessageInput send={send} messages={messages}/>
                    {/* <input type="text" placeholder="search"></input> */}
                    {/* Content for the bottom part */}
                </div>
            </div>
            <div className="profile-pic-container-emitter">
                <div className="profile-pic-last-block">
                    {/* You can add content or image for the profile picture */}
                </div>
                {name}
            </div>
        </div>
    );
};

export default TextComposerContainer;
