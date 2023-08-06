import React, { useRef, useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io, { Socket } from "socket.io-client";
import axios from 'axios';
import p5 from 'p5';
import { useAtom, atom } from 'jotai';
// import { atomWithStorage } from 'jotai/utils';
// import Ball from "./Ball";
// import Bar from "./Bar";
import { GameContext } from '../../utils/GameContext';

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
	wPlayer: number;
	hPlayer: number;
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
	wPlayer: 0,
	hPlayer: (9/16) * (window.innerWidth * 70 / 100) / 5,
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
	const game = useRef(initGame);
	const socket = useContext(GameContext);
	const location = useLocation();
	const { roomId } = location.state;
	const navigate = useNavigate();
	const p5SketchRef = useRef<p5 | null>(null);
	
	// const roomId = 1;
	
	// const images = [Chaos, CityWok, WallMart, TimmyVSJimmy];
	const sketchRef = useRef<HTMLDivElement>(null);
	const randomImage = Chaos;

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

	socket?.emit("movePlayer", roomId, 1, 0);

	useEffect(() => {
		const cookies = document.cookie.split('; ');
		let id:number;
	
		for (const cookie of cookies) {
			const [name, value] = cookie.split('=');
			if (name === 'id') {  
				id = Number(value);
			}
		}
		
		socket.on('roundStarted', (response) => {
			console.log("message === " + response.message);

			let player_height: number = (9/16) * window.innerWidth * 70 / 100 / 5;
			const updatedGame:Game = {
				...game.current,
				gameId: response.game.gameId,
				charLeft: response.game.charLeft,
				charRight: response.game.charRight,
				posLeft: (response.game.posLeft / 100 * window.innerWidth * 70 / 100) - (player_height / 2),
				posRight: (response.game.posRight / 100 * window.innerWidth * 70 / 100) - (player_height / 2),
				ball: {
					x: response.ball.x / 100 * window.innerWidth * 70 / 100,
					y: response.ball.y / 100 * window.innerWidth * 70 / 100,
					rad: response.ball.rad / 100 * window.innerWidth * 70 / 100,
					speed: response.ball.speed / 100 * window.innerWidth * 70 / 100,
					vx: response.ball.vx / 100 * window.innerWidth * 70 / 100,
					vy: response.ball.vy / 100 * window.innerWidth * 70 / 100,
				},
			}
			// setGame((prevGame) => ({
				// 	...prevGame,
				
				// }));
				game.current = updatedGame;
				console.log(game);
		})
		
		socket.on('playerMoved', (response) => {
			console.log("message === " + response.message);
			const updatedGame:Game = {
				...game.current,
				posLeft: response.posLeft / 100 * window.innerWidth * 70 / 100,
				posRight: response.posRight / 100 * window.innerWidth * 70 / 100,
			}
			game.current = updatedGame;
		})

		socket.on("ballMoved", (response) => {
			// console.log("message === " + response.message);
			const updatedGame:Game = {
				...game.current,
				ball: {
					x: response.ballX / 100 * window.innerWidth * 70 / 100,
					y: response.ballY / 100 * window.innerWidth * 70 / 100,
					rad: game.current.ball.rad,
					speed: game.current.ball.speed,
					vx: response.vx / 100 * window.innerWidth * 70 / 100,
					vy: response.vy / 100 * window.innerWidth * 70 / 100,
				}
			}
			game.current = updatedGame;
		})

		socket?.emit("roundStart", roomId);
		
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
				};

				p.draw = () => {
					p.clear();
					p.background('rgba(52, 52, 52, 0.75)');

					if (p.keyIsDown(87))
						socket?.emit("movePlayer", roomId, id, 1);
					if (p.keyIsDown(83))
						socket?.emit("movePlayer", roomId, id, 0);

					socket?.emit("moveBall", roomId);

					p.fill(255);
        			p.noStroke();
        			p.ellipse(game.current.ball.x, game.current.ball.y, game.current.ball.rad * 2);
					p.rect(cDiv.clientWidth / 75, game.current.posLeft, cDiv.clientWidth / 75, (9/16) * cDiv.clientWidth / 5);
					p.rect(cDiv.clientWidth - ((cDiv.clientWidth / 75) * 2), game.current.posRight, cDiv.clientWidth / 75, (9/16) * cDiv.clientWidth / 5);
				};

				p.windowResized = () => {
					const oldWidth:number = currentWidth;
					const oldHeight:number = currentHeight;
					cDiv = sketchRef.current!;
					currentWidth = cDiv.clientWidth;
					currentHeight = (9 / 16) * cDiv.clientWidth;
					p.resizeCanvas(cDiv.clientWidth, (9 / 16) * cDiv.clientWidth);
					const updatedGame:Game = {
						...game.current,
						posLeft: (game.current.posLeft * (9/16) * cDiv.clientWidth / oldHeight),
						posRight: (game.current.posRight * (9/16) * cDiv.clientWidth / oldHeight),
						ball: {
							x: game.current.ball.x * cDiv.clientWidth / oldWidth,
							y: game.current.ball.y * (9/16) * cDiv.clientWidth / oldHeight,
							rad: game.current.ball.rad * (9/16) * cDiv.clientWidth / oldHeight,
							speed: game.current.ball.speed * cDiv.clientWidth / oldWidth,
							vx: game.current.ball.x * cDiv.clientWidth / oldWidth,
							vy: game.current.ball.y * (9/16) * cDiv.clientWidth / oldHeight,
						},
					}
					game.current = updatedGame;
					// p.draw();
				};
      		});
    	}

		return () => {
			// Clean up the p5 sketch when the component unmounts
			p5SketchRef.current?.remove();
		};
	}, [sketchRef]);

	return (
		<>
		<GetBg randomImage={randomImage} />
		<div id="score"> {game.current.charLeft}: {game.current.scoreLeft} - {game.current.charRight}: {game.current.scoreRight} </div>
		<div id="game" ref={sketchRef}></div>
		<div id="return">
			<WhatReturnButtom randomImage={randomImage} />
		</div>
		</>
	);
}