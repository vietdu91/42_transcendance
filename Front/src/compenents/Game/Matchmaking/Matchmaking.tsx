import React, { useContext, useEffect, useState } from 'react'
import io, { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { GameContext } from '../../utils/GameContext';

import axios from "axios";

import ButtersBlood from "../../../img/backgrounds/butters_blood.jpg"

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

	const [socket, setSocket] = useState<Socket | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [inQueue, setInQueue] = useState(false);
	const [socketConnected, setSocketConnected] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const timer = setTimeout(() => {
		  setIsLoading(false);
		}, 1500);
	
		return () => clearTimeout(timer);
	  }, []);
	
	useEffect(() => {
		const newSocket = io("http://localhost:3001");

		setSocket(newSocket);

		newSocket.on('connect', () => {
			console.log('Connection established');
			setSocketConnected(true);
		});

		newSocket.on('queueJoined', (response) => {
			console.log(response.message);
			setInQueue(true);
		})

		socket.on('alreadyJoined', (response) => {
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
			if (inQueue)
				leaveQueue();
		};
	}, [inQueue]);

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

	if (isLoading || !socketConnected) {
		return <Loading />;
	  }
	
	  if (inQueue) {
		return <MatchmakingQueue leaveQueue={leaveQueue} />;
	  }
	
	  return <MatchmakingNotInQueue joinQueue={joinQueue} leavePage={leavePage} />;
}
