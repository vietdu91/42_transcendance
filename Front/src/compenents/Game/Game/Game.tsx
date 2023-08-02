import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io, { Socket } from "socket.io-client";
import axios from 'axios';
import p5 from 'p5';
import { useAtom, atom } from 'jotai';
// import { atomWithStorage } from 'jotai/utils';
import Ball from "./Ball";
import Bar from "./Bar";

// CSS
import './Game.css'

// COMPONENTS
import ReturnButtom from '../../utils/ReturnButtom/ReturnButtom'

// IMG
import Chaos from '../../../img/backgrounds/backgrounds-game/chaos.jpg'
import CityWok from '../../../img/backgrounds/backgrounds-game/city_wok.jpg'
// import WallMart from '../../../img/backgrounds/backgrounds-game/wallmart.jpg'
import TimmyVSJimmy from '../../../img/video/Timmy_Fights_Jimmy.mp4'

interface IGame {
	gameId: number;
	idLeft: number;
	idRight: number;
	scoreLeft: number;
	scoreRight: number;
	charLeft: string;
	charRight: string;
};

const initGame: IGame = {
	gameId: -1,
	idLeft: -1,
	idRight: -1,
	scoreLeft: 0,
	scoreRight: 0,
	charLeft: '',
	charRight: '',
}

// const gameAtom = atom<IGame>(initGame);

export default function Game(): JSX.Element {
	const [game, setGame] = useState(initGame);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [gameOver, setGameOver] = useState(false);
	const location = useLocation();
	const { roomId } = location.state;
	const navigate = useNavigate();
	
	// const roomId = 1;
	
	// const images = [Chaos, CityWok, WallMart, TimmyVSJimmy];
	const sketchRef = useRef<HTMLDivElement>(null);
	const randomImage = Chaos;
	
	useEffect(() => {
		getPlayers();
	}, []);
	
	if (game.scoreLeft >= 2 || game.scoreRight >= 2) {
		if (!socket)
			console.log("SOCKET NUL")
		else {
			let winnerId:number;
			if (game.scoreLeft > game.scoreRight)
				winnerId = game.idLeft;
			else
				winnerId = game.idRight;
			const gameId:number = game.gameId;
			const scoreLeft:number = game.scoreLeft;
			const scoreRight:number = game.scoreRight;
			let isWinner:boolean = false;
			const cookies = document.cookie.split('; ');
			let id:number = -1;
			
			for (const cookie of cookies) {
				const [name, value] = cookie.split('=');
				if (name === 'id')  
					id = Number(value);
			}
			if (id == winnerId) {
				// console.log("YOU ARE THE WINNER ! : " + );
				isWinner = true;
			}
			socket?.emit('leaveGame', gameId, winnerId, scoreLeft, scoreRight, isWinner);
		}
	}

	socket?.emit('roundStart', game.gameId, game.idLeft, game.idRight, game.charLeft, game.charRight);
	
  	async function getPlayers(): Promise<void> {
    	try {
     		const room = await axios.get("http://localhost:3001/Game/getGameById", { params: { roomId: roomId } });
			 if (room.data) {
				setGame((prevGame) => ({
					...prevGame,
					gameId: room.data.id,
					idLeft: room.data.playersId[0],
					idRight: room.data.playersId[1],
					charLeft: room.data.characters[0],
					charRight: room.data.characters[1],
				}));
			}
    	} catch (error) {
      		console.error(error);
    	}
	}
	
	
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

  // ... (WhatReturnButtom and GetBg components)

  // Use a ref to hold the p5 sketch instance
  	const p5SketchRef = useRef<p5 | null>(null);

	useEffect(() => {

		let ball:Ball, p1:Bar, p2:Bar;

		const gameSocket = io("http://localhost:3001/game");
		setSocket(gameSocket);

		gameSocket.on('roundStarted', (response) => {
			console.log(response.message);
		})

		gameSocket.on('gameLeaved', (response) => {
			console.log(response.message);
			if (response.isWinner)
				navigate("/")
				//navigate("/win")
			else
				navigate("/profile")
				//navigate("/gameover")
		})

		gameSocket.on('ballMoved', (response) => {
			console.log(response.message);
		})

		gameSocket.on('ballSet', (response) => {
			console.log(response.message);
		})

		if (!sketchRef.current) return;

		// Create or recreate the p5 sketch when the sketchRef changes or component mounts
		if (!p5SketchRef.current) {
			p5SketchRef.current = new p5((p: p5) => {
				let canvas: p5.Renderer | null = null;
				let cDiv: any, currentWidth: number, currentHeight: number;

				p.setup = () => {
					cDiv = sketchRef.current!;
					currentWidth = cDiv.clientWidth;
					currentHeight = (9 / 16) * cDiv.clientWidth;
					canvas = p.createCanvas(cDiv.clientWidth, (9 / 16) * cDiv.clientWidth);
					canvas.parent(cDiv);
					const player_width:number = cDiv.clientWidth / 75;
					const player_height:number = (9 / 16) * cDiv.clientWidth / 5;
					const ball_rad:number = (9 / 16) * cDiv.clientWidth / 75;
					const ball_speed:number = cDiv.clientWidth / 150;

					ball = new Ball(cDiv, p, cDiv.clientWidth / 2, (9 / 16) * cDiv.clientWidth / 2, ball_rad, ball_speed);
					p1 = new Bar(cDiv, p, player_width, (9 / 16) * cDiv.clientWidth / 2 - (player_height / 2), player_width, player_height, 0);
					p2 = new Bar(cDiv, p, cDiv.clientWidth - (player_width * 2), (9 / 16) * cDiv.clientWidth / 2 - (player_height / 2), player_width, player_height, 0);
				};

				p.draw = () => {
					if (gameOver)
						return;
					p.clear();
					p.background('rgba(52, 52, 52, 0.75)');
					p1.moveBar("w", "s");

					// jouer contre joueur humain
					p2.moveBar("up", "down");

					let out = ball.out(p1, p2);
					if (out) {
						if (out === 'left') {
							setGame((prevGame) => ({...prevGame, scoreRight: prevGame.scoreRight + 1}));
						}
						else {
							setGame((prevGame) => ({...prevGame, scoreLeft: prevGame.scoreLeft + 1}));
						}
						console.log(p1.score + " " + p2.score);
						if (p1.score >= 2 || p2.score >= 2) {
							console.log('FIN DU JEU')
							setGameOver(true);
							// setGame((prevGame) => ({...prevGame, scoreLeft: 0, scoreRight: 0}));
							p1.score = 0;
							p2.score = 0;
						}
						else {
							p1.reset(cDiv.clientWidth / 75, (9 / 16) * cDiv.clientWidth / 2 - ((9 / 16) * cDiv.clientWidth / 10));
							p2.reset(cDiv.clientWidth - (cDiv.clientWidth / 75 * 2), (9 / 16) * cDiv.clientWidth / 2 - ((9 / 16) * cDiv.clientWidth / 10));
						}
						
					}
					ball.update();
					ball.hit(p1, p2);
					p1.show();
					p2.show();
					ball.show();
					gameSocket?.emit("moveBall", ball.pos.x, ball.pos.y);
				};

				p.windowResized = () => {
					const oldWidth:number = currentWidth;
					const oldHeight:number = currentHeight;
					cDiv = sketchRef.current!;
					currentWidth = cDiv.clientWidth;
					currentHeight = (9 / 16) * cDiv.clientWidth;
					p.resizeCanvas(cDiv.clientWidth, (9 / 16) * cDiv.clientWidth);

					const player_width:number = cDiv.clientWidth / 75;
					const player_height:number = (9 / 16) * cDiv.clientWidth / 5;
					const ball_rad:number = (9 / 16) * cDiv.clientWidth / 75;
					const ball_speed:number = cDiv.clientWidth / 150;

					const p1y:number = (p1.pos.y * (9 / 16) * cDiv.clientWidth / oldHeight);
					const p2y:number = (p2.pos.y * (9 / 16) * cDiv.clientWidth / oldHeight);

					const ballX:number = (ball.pos.x * cDiv.clientWidth / oldWidth);
					const ballY:number = (ball.pos.y * (9 / 16) * cDiv.clientWidth / oldHeight);

					p1 = new Bar(cDiv, p, player_width, p1y, player_width, player_height, p1.score);
					p2 = new Bar(cDiv, p, cDiv.clientWidth - (player_width * 2), p2y, player_width, player_height, p2.score);

					p1.setAll(cDiv, player_width, p1y, player_width, player_height);
					p2.setAll(cDiv, cDiv.clientWidth - (player_width * 2), p2y, player_width, player_height);

					ball.setCDiv(cDiv);
					ball.setPos(ballX, ballY);
					ball.setRad(ball_rad);
					ball.setSpeed(ball_speed);
				};
      		});
    	}

		return () => {
			// Clean up the p5 sketch when the component unmounts
			gameSocket.disconnect();
			p5SketchRef.current?.remove();
		};
	}, [sketchRef, setGame]);

	return (
		<>
		<GetBg randomImage={randomImage} />
		<div id="score"> {game.charLeft}: {game.scoreLeft} - {game.charRight}: {game.scoreRight} </div>
		<div id="game" ref={sketchRef}></div>
		<div id="return">
			<WhatReturnButtom randomImage={randomImage} />
		</div>
		</>
	);
}