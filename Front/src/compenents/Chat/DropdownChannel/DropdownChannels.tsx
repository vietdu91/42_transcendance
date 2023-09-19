import React, { useState, useEffect } from 'react';
import './DropdownChannels.css'
import { useContext } from 'react';
import Cookies from 'js-cookie';
import { ChatContext } from '../../utils/ChatContext';
import './DropdownChannels.css'
import RedCross from "../../../img/chat/redcross.png"
import Maximize from '../../../img/chat/rsz_1maximize_1.png'
import Minimize from '../../../img/chat/minimized.jpg'
function DropdownChannels({user, setChannels}) {
	const socket = useContext(ChatContext);
	const id = Cookies.get('id');
	const [joined, setJoined] = useState(false);
	const [channelName, setChannelName] = useState('');
	const [isPrivate, setIsPrivate] = useState(false);
	const id = Cookies.get('id');
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenForCreateChannel, setIsOpenForCreateChannel] = useState(false);
	const [isOpenForJoinChannel, setIsOpenForJoinChannel] = useState(false);
	const [isOpenForDeleteChannel, setIsOpenForDeleteChannel] = useState(false);
	const [roomPassword, setRoomPassword] = useState('');
	const [joinPassword, setJoinPassword] = useState('');

	const toggleChannels = () => {
		setIsOpen(!isOpen);
	};

	const toggleCreateChannel = () => {
		setIsOpenForCreateChannel(!isOpenForCreateChannel);
	};

	const toggleJoinChannel = () => {
		setIsOpenForJoinChannel(!isOpenForJoinChannel);
	};

	const toggleDeleteChannel = () => {
		setIsOpenForDeleteChannel(!isOpenForDeleteChannel);
	};

	const handleCreate = () => {
		console.log("Created room:", channelName);
		setIsRoomCreated(true);
		const id = Cookies.get('id');
		console.log(roomPassword + "password");	
		if (roomPassword) {
			setIsPrivate(true);
			socket?.emit('createChannel', { name: channelName, ownerId: id, isPrivate: isPrivate, password: roomPassword });
		}
		else {
			socket?.emit('createChannel', { name: channelName, ownerId: id, isPrivate: isPrivate });
		}
	};

	const handleJoin = () => {
		console.log(joinPassword + " = password = " + roomPassword);
		if (joinPassword) {
			socket?.emit('joinRoom', { name: channelName, userId: id, password: joinPassword });
			setJoined(true);
		}
		else {
			socket?.emit('joinRoom', { name: channelName, userId: id });
			setJoined(true);
		}
	};

	const handleDelete = () => {
		console.log("Deleted room:", { name: channelName });
		setChannelName('');
		setIsPrivate(false);
		setJoined(false);
		socket?.emit('deleteRoom', { name: channelName, userId: id });
	}


	const handleLeave = () => {
		const id = Cookies.get('id');
		console.log("Left room:", channelName);
		setChannelName('');
		setIsPrivate(false);
		setJoined(false);
		socket?.emit('leaveRoom', { name: channelName, userId: id });
	}

	const handleBan = () => {
		const id = Cookies.get('id');
		console.log("Banned user:", id);
		socket?.emit('banRoom', { name: channelName, userId: id });
	}

	const handleKik = () => {
		const id = Cookies.get('id');
		console.log("Kicked user:", id);
		socket?.emit('kickUser', { name: channelName, userId: id });
	}

	const handleSetAdmin = () => {
		const id = Cookies.get('id');
		console.log("Set admin:", id);
		socket?.emit('setAdmin', { name: channelName, userId: id });
	}

	useEffect(() => {
		socket.on('channelCreated', (response) => {
			console.log(response);
			setChannels(response.channels);
		})
		socket.on('channelJoined', (response) => {
			setChannels(response.channels);
		})
	})

	return (
		<div className="dropdown">
			<div className="dropdown-toggle" onClick={toggleChannels}>
				Channels
			</div>
			{isOpen && (
				<ul className="dropdown-menu">
					<li onClick={toggleCreateChannel}>Create Channel</li>
					<li onClick={toggleJoinChannel}>Join Channel</li>
					<li onClick={toggleDeleteChannel}>Delete Channel</li>
				</ul>
			)}
			{isOpenForCreateChannel && (
				<div className="channel-creation-container">
					<ul className="channel-creation-navbar">
						<li className="create-channel-title">Create Channel</li>
						<div>
							<img src={Minimize} alt="minimize" id="chat_minimize" />
							<img src={Maximize} alt="Maximize" id="chat_Maximize" />
							<img src={RedCross} alt="redcross" id="chat_redcross" />
						</div>
					</ul>
					<div className="channel-creation-form">
						<div className="channel-creation-input">
							<h1>Channel Name : </h1>
							<input
								className="ze-input"
								type="text"
								placeholder="Channel Name"
								onChange={(e) => setChannelName(e.target.value)} // Capture the channel name
							/>
						</div>
						<div className="channel-creation-options">
							<div>
								<h1>Choose between these two options</h1>
								<ul>
									<input type="checkbox" id="public" />
									<label className="label-priv-pub" htmlFor="public">Public</label>
								</ul>
								<ul>
									<input type="checkbox" id="private" />
									<label className="label-priv-pub"htmlFor="private">Private</label>
								</ul>
							</div>
						</div>
						<div className="channel-creation-buttons">
							<input type="text" placeholder="Password"
							onChange={(e) => setRoomPassword(e.target.value)}	
							 />
							<button onClick={() => { handleCreate(); toggleCreateChannel(); }}>Create</button>
						</div>
					</div>
				</div>
			)}
			{
				isOpenForJoinChannel && (
					<div className="channel-join-container">
						{/* Add content for channel join */}
						<input type="text" placeholder="Channel Name"
							onChange={(e) => setChannelName(e.target.value)}
						/>
						{/* fairee apparaitre le password que si il est prive*/}
						<input type="text" placeholder="Password"
						onChange={(e) => setJoinPassword(e.target.value)}
						 />
						{/* ajouter  */}
						<button onClick={() => { handleJoin(); toggleJoinChannel(); }}>Join</button>
					</div>
				)
			}
			{
				isOpenForDeleteChannel && (
					<div className="channel-delete-container">
						{/* Add content for channel delete */}
						<input type="text" placeholder="Channel Name"
							onChange={(e) => setChannelName(e.target.value)}
						/>
						<input type="text" placeholder="Password" />
						<button onClick={() => { handleDelete(); toggleDeleteChannel(); }}>Delete</button>
					</div>
				)
			}
		</div>
	);
}

export default DropdownChannels;
