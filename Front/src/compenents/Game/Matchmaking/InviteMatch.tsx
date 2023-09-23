import React from "react";
import { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import Cookie from 'js-cookie';
import { GameContext } from "../../utils/GameContext";
import "./Matchmaking.css"

import Fire from "../../../img/backgrounds/fire_randy.jpg"
import RedCross from "../../../img/buttons/red_cross.png"
import BallsWaiting from "../../../img/balls_waiting.gif"

const MatchmakingQueue = ({ leaveQueue }) => (
	<div id="bg-black">
		<div id="waiting-black">
			<img id="red-cross" src={RedCross} alt="Red Cross" onClick={leaveQueue} />
			<img id="balls_waiting" src={BallsWaiting} alt="Balls Waiting" />
			<div id="waiting-text">Waiting</div>
		</div>
	</div>
);

const MatchmakingNotInQueue = ({ joinQueue, leavePage }) => (
	<div id="bg-game">
		<img id="bg-game" src={Fire} alt={'Fire'} />
		<img id="red-cross" src={RedCross} alt="Red Cross" onClick={leavePage} />
		<div id="waiting">
			<button id="queue-button" onClick={joinQueue}>Entrer dans la lutte</button>
		</div>
	</div>
);

export default function InviteMatch() {
	const token = Cookie.get('accessToken');
	if (!token)
		window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;
	const socket = useContext(GameContext);
	const navigate = useNavigate();
	const location = useLocation();
	const otherName = location.search.slice(location.search.lastIndexOf('=') + 1);
	const [inQueue, setInQueue] = useState(false);

	const joinQueue = () => {
		socket?.emit('joinInvite', { name: otherName });
	}

	const leaveQueue = () => {
		socket?.emit('leaveInvite');
		setInQueue(false);
	};

	const leavePage = () => {
		navigate(`/chat`);
		window.location.reload();
	}

	useEffect(() => {
		async function getUser() {
			await axios.get(
				process.env.REACT_APP_LOCAL_B + '/profile/getUserByname',
				{ withCredentials: true, params: { username: otherName }, headers: { "Authorization": `Bearer ${token}` } })
				.catch((error) => {
					if (error.response.status === 401) {
						Cookie.remove('accessToken')
						window.location.href = "/";
					}
					else {
						navigate('/chat');
						window.location.reload();
					}
				})
		}
		if (location.search && location.search.slice(0, location.search.indexOf('=') + 1) === "?other=")
			getUser();
		else {
			navigate('/chat');
			window.location.reload();
		}
		socket.on('alreadyJoined', (res) => {
		})

		socket.on('matchFound', (res) => {
			navigate(`/decompte`, { state: { roomId: res.roomId } });
		})

		socket.on('inviteJoined', (res) => {
			setInQueue(true);
		})

		socket.on('wrongUser', (response) => {
			navigate("/gamemenu");
		})

		window.addEventListener('beforeunload', () => {
			socket.emit("leaveInvite");
		})
	}, [inQueue, socket, navigate])

	if (inQueue) {
		return <MatchmakingQueue leaveQueue={leaveQueue} />;
	}

	return <MatchmakingNotInQueue joinQueue={joinQueue} leavePage={leavePage} />;
}