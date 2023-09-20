import React, { useRef, useContext, useState, useEffect } from 'react';
import './Channels.css';
import './Channels.scss';
import RedCross from '../../../img/chat/redcross.png'
import Maximize from '../../../img/chat/rsz_1maximize_1.png'
import Minimize from '../../../img/chat/minimized.jpg'
import scam from '../../../img/chat/scam-advertisement-small.jpg';
import regularConv from '../../../img/chat/regular-conv-icon.jpg';
import backgroundImage from '../../../img/chat/channel_wallpaper.png'; // Adjust the image path
import ChampSelect from '../../Game/ChampSelect/ChampSelect';
import Cookie from 'js-cookie';
import { ChatContext } from '../../utils/ChatContext';
import axios from 'axios';

function Channel({ i, max, user, channel, isVisible, blocked }) {
	const socket = useContext(ChatContext);
	const token = Cookie.get('accessToken');
	const [value, setValue] = useState('');
	const [messages, setMessages] = useState(channel.messages.filter((index) => !(blocked.includes(index.authorId))));
	const inputRef = useRef<HTMLDivElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenAction, setIsOpenAction] = useState(false);

	// type CSSProperties = React.CSSProperties & {
	// 	[key: string]: string;
	// };

	const toggleAction = () => {
		setIsOpen(!isOpen);
	}



	const handleInputChange = () => {
		if (inputRef.current) {
			setValue(inputRef.current.innerText);
		}
	};

	function goToProfile(name: string) {
		window.open(`` + process.env.REACT_APP_LOCAL_F + `/user/${name}`);
	}

	const handleSendMessage = async () => {
		if (value.trim() !== '') {
			const channId = channel.id;
			socket?.emit('sendMessageChann', { value, channId });
			setValue('');
			if (inputRef.current) {
				inputRef.current.innerText = '';
			}
		}
	};

	useEffect(() => {
		const getData = async () => {
			socket.on('messageSentChann', (res => {
				axios.get(process.env.REACT_APP_LOCAL_B + "/chat/getMessagesByChannel", { params: { id: channel.id }, headers: { 'Authorization': `Bearer ${token}` } })
					.then(response => {
						setMessages(response.data.messages);
					})
			}))
		}
		getData();
		return () => {
			socket.off('messageSentChann');
		}
	}, [socket])

	const maxTop = window.innerHeight - 80;
	const maxLeft = window.innerWidth; // Set to the right half of the screen

	const getRandomNumber = (max, sizeInPercent) => {
		const sizeInPixels = (80 / 100) * max;
		return Math.floor(Math.random() * ((max - sizeInPixels)));
	};

	// const newPosition: CSSProperties = {
	// 	'--max': "" + max,
	// 	'--top': "" + getRandomNumber(maxTop, 0),
	// 	'--left': "" + (maxLeft / 2 + getRandomNumber(maxLeft, maxLeft / 2)),
	// };

	// console.log('Generated position:', newPosition);

	return (
		<div className="chat-channel-area" >
			{isVisible && (
				<div className="channel-main-container">
					<div className="channel-bandeau">
						<ul className="reduce-maximize-quit">
							<li className="channel-name">{channel.name}</li>
							<li><img src={Minimize} alt="redcross" id="chat_redcross" /></li>
							<li><img src={Maximize} alt="maximize" id="chat_maximize" /></li>
							<li><img src={RedCross} alt="redcross" id="chat_redcross" /></li>
						</ul>
					</div>
					<div className="channel-actions">
						<ul>
							<li>File</li>
							<li>Edit</li>
							<li onClick={toggleAction}>Actions</li>
							<li>Tools</li>
						</ul>
						{isOpen && (
							<ul className="dropdown-menu">
								<li >Ban User</li>
								<li >kick User</li>
								<li >Leave</li>
								<li >Invite</li>
							</ul>
						)}
					</div>
					<div className="channel-modo-mode"><img src={scam} alt="scam" id="chat_scam" /></div>
					<div className="channel-conversation">
						<div className="channel-group-convo">
							<div className="channel-members-presentation"> {/*add le name du channel*/}
							</div>
							<div className="channel-conversation-messages">
								{messages.map((message, index) => (
									<ul key={index}>
										<li className="conv-sender-info-chan">{message.authorName}</li>
										<li className="conv-message-content-chan">{message.content}</li>
										<li className="conv-message-date-chan">{message.createdAt}</li>
									</ul>
								))}
							</div>
						</div>
						<div className="channel-profile-pic-and-member-list">
							<div className="channel-group-pic-main-container">
								<div className="channel-group-pic-cadre">
									<div className="channel-pik">
										<img alt="channel-img" src={channel.image} />
									</div>
								</div>
							</div>
							<div className="channel-group-member-list">
								<ul>
									{channel.usersList?.map((user, index) => (
										<li key={index} onClick={() => { goToProfile(user.name) }}><img src={regularConv} alt="regularConv" />{user.nickname} ({user.name})</li>
									))}
								</ul>
							</div>
						</div>
					</div>
					<div className="channel-send-messages-part">
						<div className="channel-input-text">{/*Add buttons*/}
							<div className="channel-left">
								<span
									ref={inputRef}
									className="text-area-indiv"
									role="textbox"
									contentEditable
									onInput={handleInputChange}
									onBlur={handleInputChange}
									// onKeyDown={handleKeyDown}
									style={{ whiteSpace: 'pre-wrap' }} // Enable line breaks
								></span>
							</div>
							<div className="channel-right-buttons">
								<button onClick={handleSendMessage}>Send</button>
							</div>
							{/* <button></button>
					<button></button> */}
						</div>
						<div className="channel-my-profile-pic-main-container">
							<div className="channel-my-profile-pic-group-pic-cadre">
								<div>
									<img alt="user.pfp" src={user.pfp}></img>
								</div>
								{user.name}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Channel;