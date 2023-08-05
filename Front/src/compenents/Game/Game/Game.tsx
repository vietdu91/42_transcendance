import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io, { Socket } from "socket.io-client";
import axios from 'axios';
import p5 from 'p5';
import { useAtom, atom } from 'jotai';
// import { atomWithStorage } from 'jotai/utils';
// import Ball from "./Ball";
// import Bar from "./Bar";

// CSS
import './Game.css'

// COMPONENTS
import ReturnButtom from '../../utils/ReturnButtom/ReturnButtom'

// IMG
import Chaos from '../../../img/backgrounds/backgrounds-game/chaos.jpg'
import CityWok from '../../../img/backgrounds/backgrounds-game/city_wok.jpg'
// import WallMart from '../../../img/backgrounds/backgrounds-game/wallmart.jpg'
import TimmyVSJimmy from '../../../img/video/Timmy_Fights_Jimmy.mp4'

interface Ball {
	x: number;
	y: number;
	rad: number;
	speed: number;
	vx: number;
	vy: number;
}

interface Game {
	gameId: number;
	isActive: boolean;
	idLeft: number;
	idRight: number;
	scoreLeft: number;
	scoreRight: number;
	charLeft: string;
	charRight: string;
	posLeft: number;
	posRight: number;
	ball: Ball;
};

const initGame: Game = {
	gameId: -1,
	isActive: false,
	idLeft: -1,
	idRight: -1,
	scoreLeft: 0,
	scoreRight: 0,
	charLeft: '',
	charRight: '',
	posLeft: 0,
	posRight: 0,
	ball: {
		x: 0,
		y: 0,
		rad: 0,
		speed: 0,
		vx: 0,
		vy: 0,
	},
}

export default function Game(): JSX.Element {
	
	const [game, setGame] = useState(initGame);
	const [socket, setSocket] = useState<Socket>();
	const location = useLocation();
	const { roomId } = location.state;
	const navigate = useNavigate();
	
	// const roomId = 1;
	
	// const images = [Chaos, CityWok, WallMart, TimmyVSJimmy];
	const sketchRef = useRef<HTMLDivElement>(null);
	const randomImage = Chaos;

	// console.log(roomId);
	socket?.emit("roundStart", roomId);
	
	function WhatReturnButtom({randomImage}) {
		if (randomImage === CityWok || randomImage === Chaos)
			return (
				<ReturnButtom colorHexa='#FFFFFF' path='/'/>
			)
		else
			return (
				<ReturnButtom colorHexa='#000000' path='/'/>
			)
	}

	function GetBg({randomImage}) {
		if (randomImage === TimmyVSJimmy)
			return (
				<video autoPlay muted loop className="bg opacity" src={randomImage}></video>
			)
		else
			return (
				<img className="bg" src={randomImage} alt={'bg'}></img>
			)
	}

	useEffect(() => {
		const socket = io("http://localhost:3001");
		setSocket(socket);
		
		socket.on('roundStarted', (response) => {
			console.log(response.message);
			console.log(response.ball);
			setGame((prevGame) => ({
				...prevGame,
				ball: {
					x: response.ball.x * window.innerWidth / 100,
					y: response.ball.y * window.innerWidth / 100,
					rad: response.ball.rad * window.innerWidth / 100,
					speed: response.ball.speed * window.innerWidth / 100,
					vx: response.ball.vx * window.innerWidth / 100,
					vy: response.ball.vy * window.innerWidth / 100,
				},
			}));
		})

		
	}, []);

	return (
		<>
		<GetBg randomImage={randomImage} />
		<div id="score"> {game.gameId}: {game.scoreLeft} - {game.charRight}: {game.scoreRight} </div>
		<div id="game" ref={sketchRef}></div>
		<div id="return">
			<WhatReturnButtom randomImage={randomImage} />
		</div>
		</>
	);
}