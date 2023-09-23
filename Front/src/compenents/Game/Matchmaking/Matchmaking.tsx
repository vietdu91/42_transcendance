import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { GameContext } from '../../utils/GameContext';
import Cookies from 'js-cookie';

import Fire from "../../../img/backgrounds/fire_randy.jpg"
import RedCross from "../../../img/buttons/red_cross.png"
import BallsWaiting from "../../../img/balls_waiting.gif"

import './Matchmaking.css';


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

export default function Matchmaking() {
	const token = Cookies.get('accessToken');
	if (!token)
		window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;
	const socket = useContext(GameContext);
	const [inQueue, setInQueue] = useState(false);
	const navigate = useNavigate();

	
	const joinQueue = async () => {
		socket?.emit('joinQueue');
	}
	
	const leaveQueue = async () => {
		socket?.emit('leaveQueue');
		setInQueue(false);
	};
	
	const leavePage = () => {
		navigate(`/gamemenu`);
	}
	
	
	useEffect(() => {
		async function beforeUnloadHandler() {
			socket.emit("leaveQueue");
			setInQueue(false);
			window.location.href = "/";
		}
		const handleMatchFound = (roomId: string) => {
			navigate(`/decompte`, { state: { roomId: roomId } });
		}
		socket.on('connect', () => {
		});
		
		socket.on('queueJoined', (response) => {
			setInQueue(true);
		})
		
		socket.on('alreadyJoined', (response) => {
			setInQueue(false);
		})
		
		socket.on('matchFound', (response) => {
			handleMatchFound(response.roomId);
		})

		socket.on('wrongUser', (response) => {
			alert(response.message);
			navigate("/gamemenu");
		})

		window.addEventListener('beforeunload', beforeUnloadHandler);


		return () => {
			window.removeEventListener('beforeunload', beforeUnloadHandler);
		};
	}, [inQueue, socket, navigate]);



	if (inQueue) {
		return <MatchmakingQueue leaveQueue={leaveQueue} />;
	}

	return <MatchmakingNotInQueue joinQueue={joinQueue} leavePage={leavePage} />;
}
