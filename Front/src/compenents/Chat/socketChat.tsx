import { useState, useEffect } from 'react';
import io, { Socket } from "socket.io-client";
import ReturnButtom from '../utils/ReturnButtom/ReturnButtom';
import MessageInput from '../Messages/messageInput';
import Room from '../Room/room';
import Cookies from 'js-cookie';

import RedCross from '../../img/chat/redcross.png'
import Maximize from '../../img/chat/rsz_1maximize_1.png'
import Advertisement from '../../img/chat/advertisement.jpg'

import './Chat.css';

function Chat() {

    const token = Cookies.get('accessToken');
    if (!token)
        window.location.href = "http://localhost:3000/connect";
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);

    //const [value, setValue] = useState("");
    //const [joined, setJoined] = useState(false);
    //const [room, setRoom] = useState("");

    const send = (value: string) => {
        socket?.emit('message', value);
    }

    useEffect(() => {
        // console.log('react api ==== ' + process.env.REACT_APP_ENDPOINT);
        const apiEndpoint = 'http://localhost:3001';
        const newSocket = io(apiEndpoint);
        setSocket(newSocket);
    }, [setSocket]);

    const messageListener = (newMessage: string) => {
        const authorId = Cookies.get('id');

        setMessages(prevMessages => [...prevMessages, newMessage]);

        fetch('http://localhost:3001/Southtrans/savedMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newMessage, authorId }),
        });
    }

    useEffect(() => {
        socket?.on('message', messageListener);
        return () => {
            socket?.off('message', messageListener);
        }
    }, [messageListener]);

    return (
        <>
            <div className="truc">
                <div className="left-part-chat">
                    <div className="conversations-list">
                        
                        <ul className="top-conversation-list">
                            {/* liste d'images */}
                            <li><img src={RedCross} alt="redcross" id="chat_redcross"></img></li>
                            <li><img src={Maximize} alt="maximize" id="chat_maximize"></img></li>
                            <li><img src={RedCross} alt="redcross" id="chat_redcross"></img></li>
                        </ul>
                        <ul className="option-conversation-list">
                            <li>File</li>
                            <li>Contacts</li>
                            <li>Actions</li>
                            <li>Tools</li>
                            <li>Help</li>
                        </ul>
                        <div className="topbar-conversation-list">

                        </div>
                        <div className="bottom-conversation-list">
                            <div className="info-conversation-list">

                            </div>
                            <div className="display-list-convo">

                            </div>
                            <div className="Advertisement-scope">
                                <div className="Advertisement">
                                <img src={Advertisement} alt="advertisement" id="chat_advertisement"></img>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <h1>Sakut</h1> */}
                    {/* <div className="chat-container">
                <aside>
                <header>
                <h1>Chat</h1>
                <input type="text" placeholder="search"></input>
                </header>
                </aside>
                <div className="chat-room-container">
                <Room room='Chat room name' />
                </div>
                <div className="wrapper-message-send">
                <MessageInput send={send} messages={messages} />
                </div>
                <div className="wrapper-message-received">
                </div> 
                <div className="wrapper-goback">
                <ReturnButtom colorHexa='#ff30ff' path='/' />
                </div>
            </div> */}
                </div>
                <div className="right-part-chat">
                    <div className="individual-convo-main-container">
                        <div className="navbar-conv">

                        </div>
                        <div className="receiver-big-container">
                            <div className="display-individual-convo">
                                <div className="Navbar-individual-convo">
                                    <div className="to-who">To: Name and userid.transcendance.net</div>
                                    <div className="receiver-status"></div>
                                    <div className="text-already-sent"></div>
                                </div>
                            </div>
                            <div className="profile-pic-reveiver-container">
                                <div className="profile-pic-receiver">
                                </div>
                            </div>
                        </div>
                        <div className="emitter-big-container">
                            <div className="container-write-text">
                                <div className="upper-part-write-text">

                                </div>
                                <div className="middle-part-write-text">

                                </div>
                                <div className="bottom-part-write-text">

                                </div>
                            </div>
                            <div className="profile-pic-container-emitter">
                                <div className="profile-pic-last-block">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ul className="menu-footer">
                <li className="footer-first-element">Salam</li>
                <li className="footer-element">Salut</li>
                <li className="footer-element">hola</li>
            </ul>
        </>
    );
}

export default Chat;