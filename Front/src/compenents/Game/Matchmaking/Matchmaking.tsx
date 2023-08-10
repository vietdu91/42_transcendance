import React, { useRef, useEffect, useState } from 'react'
import io, { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

import axios from "axios";

import ButtersBlood from "../../../img/backgrounds/butters_blood.jpg"

import './Matchmaking.css';

export default function Matchmaking() {

	const token = Cookies.get('accessToken');
    if (!token)
		window.location.href = "http://localhost:3000/connect";
	
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
		const id = Cookies.get('id');
		socket?.emit('joinQueue', Number(id));
	}
	
	const leaveQueue = () => {
		const id = Cookies.get('id');
		socket?.emit('leaveQueue', Number(id));
		setInQueue(false);
	  };

	const handleMatchFound = (roomId:string) => {
		navigate(`/game/${roomId}`, {state: {roomId: roomId}});
	}

	return (
		<div id="bg-game">
			<img id="bg-game" src={ButtersBlood} alt={'ButtersBlood'}></img>
			{inQueue ? (
				<div id="waiting">
					<p id="waiting-text">Waiting...</p>
					<button id="queue-button" onClick={leaveQueue}>Leave Queue</button>
				</div>
			) : (
				<div id="waiting">
					<button id="queue-button" onClick={joinQueue}>Join Queue</button>
				</div>
			)}
		</div>
	)
}