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
import moreOptions from '../../../img/chat/more-options.png';

import Virgin from '../../../img/chat/virgin.jpg'
import Logo from '../../../img/chat/group-conv.png'

function Channel({ i, max, user, channel, isVisible }) {
	const socket = useContext(ChatContext);
	const [value, setValue] = useState('');
	const [messages, setMessages] = useState(channel.messages);
	const inputRef = useRef<HTMLDivElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenAction, setIsOpenAction] = useState(false);
	const [isOpenMoreOptions, setIsOpenMoreOptions] = useState<boolean[]>(Array.from({ length: channel.usersList.length }, () => false));
	const token = Cookie.get('accessToken');
    // const [visibleItems, setVisibleItems] = useState<boolean[]>(Array.from({ length: channel.usersList.length }, () => false));

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
	const maxLeft = window.innerWidth;

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
								<ul className="channel-group-member-list-ul">

									{channel.usersList?.map((users, index) => (
										<div key={index}>
											<li className="channel-group-member-list-ul-li">
												<div className="channel-group-member-list-logo-name-pseudo">
													<img src={regularConv} alt="regularConv" />
													<div className="channel-group-member-list-nickname" onClick={() => { goToProfile(users.name) }}>{users.nickname} ({users.name} )</div>
												</div> { (user.id === channel.ownerId) &&
													<img src={moreOptions} alt="channels-more-options" id="channels-more-options" onClick={() => toggleMoreOptions(index)} />
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
								<span className="channel-up-span"
									ref={inputRef}
									// className="text-area-indiv"
									role="textbox"
									contentEditable
									onInput={handleInputChange}
									onBlur={handleInputChange}
									// onKeyDown={handleKeyDown}
									style={{ whiteSpace: 'pre-wrap' }} // Enable line breaks
								></span>
							</div>
							<div className="channel-down">
								<button className="channel-down-button" onClick={handleSendMessage}>Send</button>
							</div>
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