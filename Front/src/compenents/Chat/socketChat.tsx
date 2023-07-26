import { useState , useEffect } from 'react';
import io , { Socket } from "socket.io-client";
import Message from '../Messages/message';
import ReturnButtom from '../utils/ReturnButtom/ReturnButtom';
import MessageInput from '../Messages/messageInput';
import Room from '../Room/room';

import './Chat.css';

function Chat() {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);
    //const [value, setValue] = useState("");
    //const [joined, setJoined] = useState(false);
    //const [room, setRoom] = useState("");

    const send = (value: string) => {
        socket?.emit('message', value);
    }
    
    useEffect(() => {
        console.log('react api ==== ' + process.env.REACT_APP_API_ENDPOINT);
        const apiEndpoint = 'http://localhost:3001';
        const newSocket = io(apiEndpoint);
        setSocket(newSocket);
    }, [setSocket]);

    const messageListener = (newMessage: string) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
    }

    useEffect(() => {
        socket?.on('message', messageListener);
        return () => {
            socket?.off('message', messageListener);
        }
    }, [messageListener]);

    return (
        <>  
            <div className="chat-container">
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
                    <MessageInput send={send} messages={messages}/>
                </div>
                {/* <div className="wrapper-message-received"> */}
                {/* </div> */}
                <div className="wrapper-goback">
                    <ReturnButtom colorHexa='#ff30ff' path='/' />
                </div>
            </div>
        </>
    ); 
}

export default Chat;