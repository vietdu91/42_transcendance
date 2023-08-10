import { useState , useEffect } from 'react';
import io , { Socket } from "socket.io-client";
import ReturnButtom from '../utils/ReturnButtom/ReturnButtom';
import MessageInput from '../Messages/messageInput';
import Room from '../Room/room';
import Cookies from 'js-cookie';

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
      body: JSON.stringify({ content: newMessage , authorId}),
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