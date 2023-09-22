import React, { useRef, useContext, useState, useEffect } from 'react';
import './Channels.css';

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
import groupConv from '../../../img/chat/group-conv.png';
import blockUser from '../../../img/chat/block_user.png';
import banUser from '../../../img/chat/ban_user.png';

import Virgin from '../../../img/chat/virgin.jpg'
import Logo from '../../../img/chat/group-conv.png'
import Info from '../../../img/chat/info.png'

function Channel({ user, channel, isVisible, blocked }) {
	const socket = useContext(ChatContext);
	const token = Cookie.get('accessToken');
	const [value, setValue] = useState('');
	const [messages, setMessages] = useState(channel.messages.filter((index) => !(blocked.includes(index.authorId))));
	const inputRef = useRef<HTMLDivElement | null>(null);
	const divRef = useRef<HTMLDivElement | null>(null);
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

	const toggleMoreOptions = (index: number) => {
		const newOptions = [...isOpenMoreOptions];
        newOptions[index] = !newOptions[index];
		setIsOpenMoreOptions(newOptions);
	}

	function goToProfile(name: string) {
		window.open(`` + process.env.REACT_APP_LOCAL_F + `/user/${name}`);
	}

	const handleSendMessage = async () => {
		if (value.trim() !== '') {
			const channId = channel.id;
			socket?.emit('sendMessageChann', { value, channId });
			scrollToBottom();
			setValue('');
			if (inputRef.current) {
				inputRef.current.innerText = '';
			}
		}
	};

	const scrollToBottom = () => {
		if (divRef.current) {
			divRef.current.scrollTop = divRef.current.scrollHeight;
		}
	};
	scrollToBottom();

	useEffect(() => {
		scrollToBottom();
		const getData = async () => {
			socket.on('messageSentChann', (res => {
				axios.get(process.env.REACT_APP_LOCAL_B + "/chat/getMessagesByChannel", { params: { id: channel.id }, headers: { 'Authorization': `Bearer ${token}` } })
					.then(response => {
						setMessages(response.data.messages);
					})
					.catch(error => {
						if (error.response.status === 401) {
							Cookie.remove('accessToken')
							window.location.href = "/";
						}
					})
			}))
		}
		getData();
		return () => {
			socket.off('messageSentChann');
		}
	}, [socket, scrollToBottom])

	return (
		<div className="chat-channel-area">
			{isVisible && (
				<div className="channel-main-container">
					<ul className="channel-bandeau">
            		  <li className="icon-messenger"><img src={Logo} alt="logo" id="logo" /></li>
            		  <li className="invite-contact-title">{channel.name}</li>
            		  <div className="ddc-right-icons">
            		    <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Minimize"></button></li>
            		    <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Maximize"></button></li>
            		    <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Close"></button></li>
            		  </div>
            		</ul>
					<div className="channel-actions">
						<ul className="channel-actions-menu">
							<li>File</li>
							<li>Edit</li>
							<li onClick={toggleAction}>Actions</li>
							<li>Tools</li>
						</ul>
						{isOpen && (
							<ul className="channel-dropdown-menu">
								<li>Ban User</li>
								<li>Kick User</li>
								<li>Leave</li>
								<li>Invite</li>
							</ul>
						)}
					</div>
					<div className="channel-modo-mode"><img src={Virgin} alt="scam" id="chat_scam" /></div>
					<div className="channel-conversation">
						<div className="channel-group-convo">
							<div className="channel-members-presentation"> 
								<div className="channel-members-presentation-text">
									<img alt="info" src={Info} className="channel-info"></img>
									...add le name du channel...
								</div>	
							</div>
							<div className="channel-conversation-messages" ref={divRef}>
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
								<ul className="channel-group-member-list-ul">

									{channel.usersList?.map((users, index) => (
										<div key={index}>
											<li className="channel-group-member-list-ul-li">
												<div className="channel-group-member-list-logo-name-pseudo">
													<img src={regularConv} alt="regularConv" />
													<div className="channel-group-member-list-nickname" onClick={() => { goToProfile(users.name) }}>{users.nickname} ({users.name} )</div>
												</div> 
												{ (user.id === channel.ownerId) &&
													(<span id="channels-more-options" onClick={() => toggleMoreOptions(index)}>
														{!isOpenMoreOptions[index] && "▸"}
														{isOpenMoreOptions[index] && "▾"}
													</span>)
												}
											</li>
											<div className="channel-group-member-list-ban-block">
												{isOpenMoreOptions[index] && (
													<div className="channels-more-options-dropdown">
														<div className="channel-more-option-choose">
															What do we do with (insert name) ?
														</div>
														<ul className="channel-more-option-choose-buttons">
															<button>KICK</button>
															<button>BAN</button>
															<button>SET ADMIN</button>
															<button>MUTE</button>
														</ul>
														{/* Add the content you want to display when isOpenMoreOptions is true */}
													</div>
												)}
												{/* 
												<img src={banUser} alt="channels-ban-user" id="channels-ban-user" />
												<img src={blockUser} alt="channels-block-user" id="channels-block-user" /> */}
											</div>
										</div>
									))}
								</ul>
							</div>
						</div>
					</div>
					<div className="channel-send-messages-part">
						<div className="channel-input-text">
							<div className="channel-up">
								<div className="channel-input-empty"></div>
								<span className="channel-up-span"
									ref={inputRef}
									role="textbox"
									contentEditable
									onInput={handleInputChange}
									onBlur={handleInputChange}
									// onKeyDown={handleKeyDown}
									style={{ whiteSpace: 'pre-wrap' }} // Enable line breaks
								></span>
								<div className="channel-down">
									<button className="channel-down-button" onClick={handleSendMessage}>Send</button>
									<button className="channel-down-button" id="wizz-button" onClick={handleSendMessage}>🫨</button>
								</div>
							</div>
						</div>
						<div className="channel-my-profile-pic-main-container">
							<div className="channel-my-profile-pic-group-pic-cadre">
								<div>
									<img alt="user.pfp" src={user.pfp}></img>
								</div>
								<span className="channel-infos-user">								
									<span className="channel-infos-user-name">{user.name}</span>	
									<span className="channel-infos-user-triangle">▾</span>
								</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Channel;