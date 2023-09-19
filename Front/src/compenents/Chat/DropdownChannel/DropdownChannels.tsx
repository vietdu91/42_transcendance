import React, { useState, useEffect } from 'react';
import './DropdownChannels.css'
import { useContext } from 'react';
import Cookies from 'js-cookie';
import { ChatContext } from '../../utils/ChatContext';
import './DropdownChannels.css'
import RedCross from "../../../img/chat/redcross.png"
import Maximize from '../../../img/chat/rsz_1maximize_1.png'
import Minimize from '../../../img/chat/minimized.jpg'
function DropdownChannels({ user }) {
	const socket = useContext(ChatContext);
	const [joined, setJoined] = useState(false);
	const [channelName, setChannelName] = useState('');
	const [isRoomCreated, setIsRoomCreated] = useState(false);
	const [isPrivate, setIsPrivate] = useState(false);

	const [isOpen, setIsOpen] = useState(false);
	const [isOpenForCreateChannel, setIsOpenForCreateChannel] = useState(false);
	const [isOpenForJoinChannel, setIsOpenForJoinChannel] = useState(false);
	const [isOpenForDeleteChannel, setIsOpenForDeleteChannel] = useState(false);
	const id = Cookies.get('id');

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
		socket?.emit('createChannel', { name: channelName, ownerId: id, isPrivate: isPrivate });

	};

	const handleJoin = () => {
		const id = Cookies.get('id');
		socket?.emit('joinRoom', { name: channelName, userId: id });
		setJoined(true);
	};

	const handleDelete = () => {
		console.log("Deleted room:", { name: channelName });
		setChannelName('');
		setIsRoomCreated(false);
		setIsPrivate(false);
		setJoined(false);
		socket?.emit('deleteRoom', { name: channelName });
	}


	const handleLeave = () => {
		const id = Cookies.get('id');
		console.log("Left room:", channelName);
		setChannelName('');
		setIsRoomCreated(false);
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
			console.log(response.message);
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
							<img onClick={() => { toggleCreateChannel(); }}src={RedCross} alt="redcross" id="chat_redcross" />
						</div>
					</ul>
					<div className="channel-creation-form">
						<div className="channel-creation-input">
							<h1 className="question">Channel Name : </h1>
							<input
								className="ze-input"
								type="text"
								placeholder="Channel Name"
								onChange={(e) => setChannelName(e.target.value)} // Capture the channel name
							/>
						</div>
						<div className="channel-creation-options">
							<div>
								<h1 className="question">Choose between these two options</h1>
								<ul>
									<input type="radio" name="privacy" value="public"/>
									<label className="label-priv-pub" htmlFor="public">Public</label>
									<input type="radio" name="privacy" value="private"/>
									<label className="label-priv-pub" htmlFor="private">Private</label>
								</ul>
							</div>
						</div>
						<div className="channel-creation-buttons">
							<input type="text" placeholder="Password" />
							<button onClick={() => { handleCreate(); toggleCreateChannel(); }}>Create</button>
						</div>
					</div>
				</div>
			)}
			{
				isOpenForJoinChannel && (
					<div className="channel-join-container">
						<ul className="channel-join-navbar">
							<li className="join-channel-title">Join Channel</li>
							<div>
								<img src={Minimize} alt="minimize" id="chat_minimize" />
								<img src={Maximize} alt="Maximize" id="chat_Maximize" />
								<img onClick={() => { toggleJoinChannel(); }}src={RedCross} alt="redcross" id="chat_redcross" />
							</div>
						</ul>
						<h3 className="question">Which channel do you want to join ?:</h3>
						<div className="channel-join-form">
							<div className="channel-join-input">
								<h1>Channel Name : </h1>
								<input type="text" placeholder="Channel Name"
									onChange={(e) => setChannelName(e.target.value)}
								/>
							</div>
						</div>
						<div className="channel-join-options">
							<h1>If private enter Password</h1>
							<input type="text" placeholder="Password" />
							{/* ajouter  */}
						</div>
						<div className="buttons-join-cancel">
							<button onClick={() => { toggleJoinChannel(); }}>Cancel</button>
							<button onClick={() => { handleJoin(); toggleJoinChannel(); }}>Join</button>
						</div>
					</div>
				)
			}
			{
				isOpenForDeleteChannel && (
					<div className="channel-delete-container">
						<ul className="channel-delete-navbar">
							<li className="delete-channel-title">Delete Channel</li>
							<div>
								<img src={Minimize} alt="minimize" id="chat_minimize" />
								<img src={Maximize} alt="Maximize" id="chat_Maximize" />
								<img onClick={() => { toggleDeleteChannel(); }} src={RedCross} alt="redcross" id="chat_redcross" />
							</div>
						</ul>
						<h3 className="question">Which channel do you want to delete ?</h3>
						<div className="channel-delete-form">
							<div className="channel-delete-input">
								<h1>Channel Name : </h1>
								<input type="text" placeholder="Channel Name"
									onChange={(e) => setChannelName(e.target.value)}
								/>
							</div>
						</div>
						<div className="channel-delete-options">
							<h1>If private enter Password</h1>
							<input type="text" placeholder="Password" />
						</div>
						<div className="buttons-delete-cancel">
							<button onClick={() => { toggleDeleteChannel(); }}>Cancel</button>
							<button onClick={() => { handleDelete(); toggleDeleteChannel(); }}>Delete</button>
						</div>
					</div>
				)
			}
		</div>
	);
}

export default DropdownChannels;
