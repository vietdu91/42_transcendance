import React, { useRef, useEffect, useState } from 'react'
import io, { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import Fire from "../../../img/backgrounds/fire_randy.jpg"
import RedCross from "../../../img/buttons/red_cross.png"
import BallsWaiting from "../../../img/balls_waiting.gif"

import './Matchmaking.css';

export default function Matchmaking() {

	const [socket, setSocket] = useState<Socket | null>(null);
	const [inQueue, setInQueue] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const newSocket = io("http://localhost:3001");

		setSocket(newSocket);

		newSocket.on('connect', () => {
			console.log('Connection established');
		});

		newSocket.on('queueJoined', (response) => {
			console.log(response.message);
			setInQueue(true);
		})

		newSocket.on('alreadyJoined', (response) => {
			console.log(response.message);
			setInQueue(true);
		})

		newSocket.on('matchFound',(response) => {
			handleMatchFound(response.roomId);
		})

		newSocket.on('disconnect', () => {
				console.log('Disconnected');
		})

		return () => {
			newSocket.disconnect();
			if (inQueue)
			leaveQueue();
		};
	}, []);

	const joinQueue = () => {
		const cookies = document.cookie.split('; ');
		let id:string = '';

		for (const cookie of cookies) {
			const [name, value] = cookie.split('=');
			if (name === 'id')
				id = value;
		}
		socket?.emit('joinQueue', Number(id));
	}

	const leaveQueue = () => {
		const cookies = document.cookie.split('; ');
		let id:string = '';

		for (const cookie of cookies) {
			const [name, value] = cookie.split('=');
			if (name === 'id')
				id = value;
		}
		socket?.emit('leaveQueue', Number(id));
		setInQueue(false);
	  };

	const leavePage = () => {
		navigate(`/gamemenu`);
	}

	const handleMatchFound = (roomId:string) => {
		navigate(`/game/${roomId}`, {state: {roomId: roomId}});
	}

	return (
	<>
		{inQueue ? (
			<div id="bg-black">
				<div id="waiting-black">
					<img id="red-cross" src={RedCross} onClick={leaveQueue}></img>
					<img id="balls_waiting" src={BallsWaiting}></img>
					<div id="waiting-text">Waiting</div>
				</div>
			</div>
		) : (
			<div id="bg-game">
				<img id="bg-game" src={Fire} alt={'Fire'}></img>
				<img id="red-cross" src={RedCross} onClick={leavePage}></img>
				<div id="waiting">
					<button id="queue-button" onClick={joinQueue}>Entrer dans la lutte</button>
				</div>
			</div>
		)}
	</>
	)
}
