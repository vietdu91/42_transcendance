import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import p5 from 'p5';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
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

const initGame: Game = {
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

//   const location = useLocation();
//   const { roomId } = location.state;

	const roomId = 1;

	const images = [Chaos, CityWok, WallMart, TimmyVSJimmy];
	const sketchRef = useRef<HTMLDivElement>(null);
	const randomImage = Chaos;

	let scoreL:number, scoreR:number;
	
	useEffect(() => {
		getPlayers();
	}, []); // Empty dependency array ensures it runs only on mount
	
  	async function getPlayers(): Promise<void> {
    	try {
     		const room = await axios.get("http://localhost:3001/Game/getGameById", { params: { roomId: roomId } });
      		console.log(room.data);
      		if (room.data) {
				setGame((prevGame) => ({
					...prevGame,
					gameId: room.data.id,
					scoreLeft: room.data.score[0], // Assuming the score array contains left score at index 0 and right score at index 1
					scoreRight: room.data.score[1],
					charLeft: room.data.characters[0], // Assuming the characters array contains left character at index 0 and right character at index 1
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
		if (!sketchRef.current) return;

		// Create or recreate the p5 sketch when the sketchRef changes or component mounts
		if (!p5SketchRef.current) {
			p5SketchRef.current = new p5((p: p5) => {
				let canvas: p5.Renderer | null = null;
				let cDiv: any, currentWidth: number, currentHeight: number;

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

					let out = ball.out(p1, p2);
					if (out) {
						if (out == 'left') {
							setGame((prevGame) => ({...prevGame, scoreRight: prevGame.scoreRight + 1}));
						}
						else {
							setGame((prevGame) => ({...prevGame, scoreLeft: prevGame.scoreLeft + 1}));
						}
						console.log(p1.score + " " + p2.score);
						if (p1.score >= 5 || p2.score >= 5) {
							console.log('FIN DU JEU')
							setGame((prevGame) => ({...prevGame, scoreLeft: 0, scoreRight: 0}));
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
			p5SketchRef.current?.remove();
		};
	}, [sketchRef]);

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