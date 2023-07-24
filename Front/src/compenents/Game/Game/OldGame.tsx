import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import p5 from 'p5';
import {useAtom} from 'jotai';
import {atomWithStorage} from 'jotai/utils';
import Ball from "./Ball";
import Bar from "./Bar";

// CSS
import './Game.css'

// COMPONENTS
import ReturnButtom from '../../utils/ReturnButtom/ReturnButtom'

// IMG
import Chaos from '../../../img/backgrounds/backgrounds-game/chaos.jpg'
import CityWok from '../../../img/backgrounds/backgrounds-game/city_wok.jpg'
import WallMart from '../../../img/backgrounds/backgrounds-game/wallmart.jpg'
import TimmyVSJimmy from '../../../img/video/Timmy_Fights_Jimmy.mp4'

interface Game {
	gameId: number;
	idLeft: number;
	idRight: number;
	scoreLeft: number;
	scoreRight: number;
	charLeft: string;
	charRight: string;
};

const initGame:Game = {
	gameId: -1,
	idLeft: -1,
	idRight: -1,
	scoreLeft: -1,
	scoreRight: -1,
	charLeft: '',
	charRight: '',
}

const gameAtom = atomWithStorage<Game>('game', initGame);

export default function Game(): JSX.Element {
	
	const [game, setGame] = useAtom(gameAtom);

	const location = useLocation();
	const { roomId } = location.state;

	const images = [Chaos, CityWok, WallMart, TimmyVSJimmy];
	const sketchRef = useRef<HTMLDivElement>(null);
	// const randomImage = getRandomImage(images);
	const randomImage = Chaos;

	async function getPlayers(): Promise<void> {
		try {
			const room = await axios.get("http://localhost:3001/Game/getGameById", {params: {roomId: roomId}});
			if (room.data) {
				setGame((prevGame) => ({...prevGame,
					gameId: room.data.id,
					scoreLeft: room.data.score[0],
					scoreRight: room.data.score[1],
					charLeft: room.data.characters[0],
					charRight: room.data.characters[1],
				}))
			}
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		getPlayers();
	}, []);

	function getRandomImage(images: string[]): string {
		const index = Math.floor(Math.random() * images.length);
		return images[index];
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

	useEffect(() => {
		let ball:Ball, p1:Bar, p2:Bar;
		const sketch = new p5((p:p5) => {
			let canvas: p5.Renderer;
			let cDiv:any, currentWidth:number, currentHeight:number;

			p.setup = () => {
				getPlayers();
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

				p.clear();
				p.background('rgba(52, 52, 52, 0.75)');
				p1.moveBar("w", "s");

				// jouer contre joueur humain
				p2.moveBar("up", "down");

				let out= 'hihi';
				// let out = ball.out();
				if (out) {
					if (out == 'left') {
						console.log(game.scoreRight)
						setGame((prevGame) => ({...prevGame, scoreRight: prevGame.scoreRight + 1}));
						console.log(game.scoreRight)
					}
					else {
						console.log(game.scoreLeft)
						setGame((prevGame) => ({...prevGame, scoreLeft: prevGame.scoreLeft + 1}));
						console.log(game.scoreLeft)
					}
					console.log(game);
					if (game.scoreLeft >= 5 || game.scoreRight >= 5) {
						console.log('FIN DU JEU')
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
		return () => {
			sketch.remove();
		};
	}, [game]);

	return (
		<>
			<GetBg randomImage={randomImage}/>
			<div id="score"> {game.charLeft}: {game.scoreLeft} - {game.charRight}: {game.scoreRight} </div>
			<div id="game" ref={sketchRef}></div>
			<div id="return">
				<WhatReturnButtom randomImage={randomImage}/>
			</div>
		</>
	);
}