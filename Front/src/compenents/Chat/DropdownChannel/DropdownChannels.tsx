import React, { useState, useEffect } from 'react';
import './DropdownChannels.css'
import { useContext } from 'react';
// import Cookies from 'js-cookie';
import { ChatContext } from '../../utils/ChatContext';
import './DropdownChannels.css'
import RedCross from "../../../img/chat/redcross.png"
import Maximize from '../../../img/chat/rsz_1maximize_1.png'
import Minimize from '../../../img/chat/minimized.jpg'

import Logo from '../../../img/chat/group-conv.png'


function DropdownChannels({ user, setChannels }) {
	const socket = useContext(ChatContext)
	const [joined, setJoined] = useState(false);
	const [channelName, setChannelName] = useState('');
	const [isPrivate, setIsPrivate] = useState(false)
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenForCreateChannel, setIsOpenForCreateChannel] = useState(false);
	const [isOpenForJoinChannel, setIsOpenForJoinChannel] = useState(false);
	const [isOpenForDeleteChannel, setIsOpenForDeleteChannel] = useState(false);
	const [roomPassword, setRoomPassword] = useState('');
	const [joinPassword, setJoinPassword] = useState('');
	const [isPasswordEnabled, setPasswordEnabled] = useState(false);

	const handlePublicButtonClick = () => {
	  setPasswordEnabled(false);
	};

	const handlePrivateButtonClick = () => {
		setPasswordEnabled(true);
	};
  

	const toggleChannels = () => {
		setIsOpen(!isOpen);
	};

	const toggleCreateChannel = () => {
		setIsOpenForCreateChannel(!isOpenForCreateChannel);
		setIsOpen(!isOpen);
	};

	const toggleJoinChannel = () => {
		setIsOpenForJoinChannel(!isOpenForJoinChannel);
		setIsOpen(!isOpen);
	};

	const toggleDeleteChannel = () => {
		setIsOpenForDeleteChannel(!isOpenForDeleteChannel);
		setIsOpen(!isOpen);
	};

	const handleCreate = () => {
		if (roomPassword) {
			setIsPrivate(true);
			socket?.emit('createChannel', { name: channelName, isPrivate: isPrivate, password: roomPassword });
		}
		else {
			socket?.emit('createChannel', { name: channelName, isPrivate: isPrivate });
		}
		setChannelName('');
	};

	const handleJoin = () => {
		if (joinPassword) {
			socket?.emit('joinChannel', { name: channelName, password: joinPassword });
			setJoined(true);
		}
		else {
			socket?.emit('joinChannel', { name: channelName, password: null });
			setJoined(true);
		}
		setChannelName('');
	};

	const handleDelete = () => {
		setChannelName('');
		setIsPrivate(false);
		setJoined(false);
		socket?.emit('deleteRoom', { name: channelName });
	}


	const handleLeave = () => {
		setChannelName('');
		setIsPrivate(false);
		setJoined(false);
		socket?.emit('leaveRoom', { name: channelName });
	}

	const handleBan = () => {
		socket?.emit('banRoom', { name: channelName });
	}

	const handleKik = () => {
		socket?.emit('kickUser', { name: channelName });
	}

	const handleSetAdmin = () => {
		socket?.emit('setAdmin', { name: channelName });
	}

	useEffect(() => {
		socket.on('channelCreated', (response) => {
			setChannels(response.channels);
			setFriends(response.friends);
		})
		
		socket.on('channelJoined', (response) => {
			setChannels(response.channels);
			setFriends(response.friends);
		})
	})

	return (
	<>
		<div className="dropdown">
			<li className="option-conversation-option" id="option-channels" onClick={toggleChannels}>
				Channels
			</li>
			{isOpen && (
				<ul className="dropdown-menu">
					<li onClick={toggleCreateChannel}>Create Channel</li>
					<li onClick={toggleJoinChannel}>Join Channel</li>
					<li onClick={toggleDeleteChannel}>Delete Channel</li>
				</ul>
			)}
			{
				isOpenForCreateChannel && (
					<div className="channel-creation-container" >
					<ul className="channel-creation-navbar">
						<li className="icon-messenger"><img src={Logo} alt="logo" id="logo" /></li>
						<li className="create-channel-title">Create Channel</li>
						<div className="ddc-right-icons">
							<li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Minimize"></button></li>
                   			<li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Maximize"></button></li>
                    		<li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Close" onClick={() => { toggleCreateChannel(); }}></button></li>
						</div>
					</ul>
					<div className="channel-creation-form">
						<div className="channel-creation-input">
							<h1 className="question">Channel Name :</h1>
							<input
								className="ze-input"
								type="text"
								placeholder="Channel Name"
								onChange={(e) => setChannelName(e.target.value)} // Capture the channel name
								/>
						</div>
						<div className="channel-creation-options">
							<fieldset className="channel-creation-fieldset">
  								<legend className="channel-creation-legend">Choose between these two options</legend>
  								<div className="channel-creation-public">
  								  <input onClick={handlePublicButtonClick} value="public" type="radio" name="privacy"></input>
  								  <label className="label-priv-pub" htmlFor="public">Public</label>
  								</div>
  								<div className="channel-creation-private">
  								  <input onClick={handlePrivateButtonClick} value="private" type="radio" name="privacy"></input>
  								  <label className="label-priv-pub" htmlFor="private">Private</label>
  								</div>
							</fieldset>
						</div>
						<div className="channel-creation-buttons">
							<input type="text" placeholder="Password" className={`${isPasswordEnabled ? "channel-creation-password" : "channel-creation-password-disabled"}`}
								disabled={!isPasswordEnabled} onChange={(e) => setRoomPassword(e.target.value)}
								/>
							<button className="button-create" onClick={() => { handleCreate(); toggleCreateChannel(); }}>Create</button>
						</div>
					</div>
				</div>
			)}
			{
				isOpenForJoinChannel && (
					<div className="channel-join-container">
						<ul className="channel-join-navbar">
							<li className="icon-messenger"><img src={Logo} alt="logo" id="logo" /></li>
							<li className="create-channel-title">Join Channel</li>
							<div className="ddc-right-icons">
								<li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Minimize"></button></li>
                   				<li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Maximize"></button></li>
                    			<li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Close" onClick={() => { toggleJoinChannel(); }}></button></li>
							</div>
						</ul>
						<fieldset className="channel-join-fieldset">
  							<legend className="channel-join-legend">Which channel do you want to join ?</legend>
								<div className="channel-join-form">
									<div className="channel-join-input">
										<h1 className="question">Channel Name : </h1>
										<input className="ze-input"
											type="text" placeholder="Channel Name"
											onChange={(e) => setChannelName(e.target.value)}
											/>
									</div>
								</div>
						</fieldset>
						<div className="channel-join-options">
							<h1 className="question">If private, enter a Password: </h1>
							<input className="ze-input" type="text" placeholder="Password"
								onChange={(e) => setJoinPassword(e.target.value)}
								/>
						</div>
						<div className="buttons-join-cancel">
							<button className="button-join-cancel" onClick={() => { toggleJoinChannel(); }}>Cancel</button>
							<button className="button-join-join" onClick={() => { handleJoin(); toggleJoinChannel(); }}>Join</button>
						</div>
					</div>
				)
			}
			{
				isOpenForDeleteChannel && (
					<div className="channel-delete-container">
						<ul className="channel-delete-navbar">
							<li className="icon-messenger"><img src={Logo} alt="logo" id="logo" /></li>
							<li className="create-channel-title">Delete Channel</li>
							<div className="ddc-right-icons">
								<li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Minimize"></button></li>
								   <li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Maximize"></button></li>
								<li className="ddc-li-topbar"><button className="chat-icons-messenger" aria-label="Close" onClick={() => { toggleDeleteChannel(); }}></button></li>
							</div>
						</ul>
						<fieldset className="channel-join-fieldset">
							  <legend className="channel-join-legend">Which channel do you want to delete ?</legend>
								<div className="channel-join-form">
									<div className="channel-join-input">
										<h1 className="question">Channel Name : </h1>
										<input className="ze-input"
											type="text" placeholder="Channel Name"
											onChange={(e) => setChannelName(e.target.value)}
											/>
									</div>
								</div>
						</fieldset>
						<div className="channel-join-options">
							<h1 className="question">If private, enter a Password: </h1>
							<input className="ze-input" type="text" placeholder="Password"
								onChange={(e) => setJoinPassword(e.target.value)}
							/>
						</div>
						<div className="buttons-join-cancel">
							<button className="button-join-cancel" onClick={() => { toggleDeleteChannel(); }}>Cancel</button>
							<button className="button-join-join" onClick={() => { handleJoin(); toggleDeleteChannel(); }}>Join</button>
						</div>
					</div>
				)
			}
		</div>
	</>
	);
}

export default DropdownChannels;
