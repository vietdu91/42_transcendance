import React, { useRef, useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import p5 from 'p5';
import { GameContext } from '../../utils/GameContext';
import Cookies from 'js-cookie';

// CSS
import './Game.css'

// COMPONENTS
import ReturnButtom from '../../utils/ReturnButtom/ReturnButtom'

// IMG
import Chaos from '../../../img/backgrounds/backgrounds-game/chaos.jpg'
import CityWok from '../../../img/backgrounds/backgrounds-game/city_wok.jpg'
// import WallMart from '../../../img/backgrounds/backgrounds-game/wallmart.jpg'
import TimmyVSJimmy from '../../../img/video/Timmy_Fights_Jimmy.mp4'

interface IBall {
	x: number;
	y: number;
	rad: number;
	speed: number;
	vx: number;
	vy: number;
}

interface IGame {
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
	wLeft: number;
	hLeft: number;
	wRight: number;
	hRight: number;
	tocLeft: number;
	tocRight: number;
	ball: IBall;
};

const initGame: IGame = {
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
	wLeft: 0,
	hLeft: 0,
	wRight: 0,
	hRight: 0,
	tocLeft: 0,
	tocRight: 0,
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
	const token = Cookies.get('accessToken');
    if (!token)
        window.location.href = "http://localhost:3000/connect";
	const game = useRef(initGame);
	const socket = useContext(GameContext);
	const [scoreLeft, setScoreLeft] = useState(0);
	const [scoreRight, setScoreRight] = useState(0);
	const location = useLocation();
	if (location.state === null)
		window.location.href = "/";
	const { roomId } = location.state;
	const navigate = useNavigate();
	const p5SketchRef = useRef<p5 | null>(null);
	
	
	// const images = [Chaos, CityWok, WallMart, TimmyVSJimmy];
	const sketchRef = useRef<HTMLDivElement>(null);
	const randomImage = Chaos;

	const cookies = document.cookie.split('; ');
	let id:number;

	for (const cookie of cookies) {
		const [name, value] = cookie.split('=');
		if (name === 'id') {  
			id = Number(value);
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

	socket?.emit("movePlayer", roomId, 1, 0);

	useEffect(() => {
		let powLeft: boolean = false;
		let powRight: boolean = false;
		let weed: boolean = false;
		let timmy: boolean = false;
		let fart: boolean = false;
		let toc: boolean = false;

		socket.on('roundStarted', (response) => {
			console.log("message === " + response.message);

			let player_height: number = (9/16) * window.innerWidth * 70 / 100 / 5;
			const updatedGame:IGame = {
				...game.current,
				gameId: response.game.gameId,
				idLeft: response.game.idLeft,
				idRight: response.game.idRight,
				scoreLeft: response.game.scoreLeft,
				scoreRight: response.game.scoreRight,
				charLeft: response.game.charLeft,
				charRight: response.game.charRight,
				wLeft: response.game.wLeft / 100 * window.innerWidth * 70 / 100,
				hLeft: response.game.hLeft / 100 * window.innerWidth * 70 / 100,
				wRight: response.game.wRight / 100 * window.innerWidth * 70 / 100,
				hRight: response.game.hRight / 100 * window.innerWidth * 70 / 100,
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
			game.current = updatedGame;
			setScoreLeft(game.current.scoreLeft);
			setScoreRight(game.current.scoreRight);
			powLeft = powRight = weed = timmy = fart = toc = false;
		})
		
		socket.on('playerMoved', (response) => {
			console.log("message === " + response.message);
			const updatedGame:IGame = {
				...game.current,
				posLeft: response.posLeft / 100 * window.innerWidth * 70 / 100,
				posRight: response.posRight / 100 * window.innerWidth * 70 / 100,
			}
			game.current = updatedGame;
		})

		socket.on("ballMoved", (response) => {
			const updatedGame:IGame = {
				...game.current,
				tocLeft: response.game.tocLeft / 100 * window.innerWidth * 70 / 100,
				tocRight: response.game.tocRight / 100 * window.innerWidth * 70 / 100,
				ball: {
					x: response.ballX / 100 * window.innerWidth * 70 / 100,
					y: response.ballY / 100 * window.innerWidth * 70 / 100,
					rad: game.current.ball.rad,
					speed: response.speed / 100 * window.innerWidth * 70 / 100,
					vx: response.vx / 100 * window.innerWidth * 70 / 100,
					vy: response.vy / 100 * window.innerWidth * 70 / 100,
				}
			}
			game.current = updatedGame;
		})

		socket.on("usedPower", (response) => {
			console.log(response.message);
			if (response.id === game.current.idLeft) {
				powLeft = true;
				switch (response.char) {
					case "Cartman" : game.current.hLeft = response.game.hLeft / 100 * window.innerWidth * 70 / 100; break;
					case "Servietsky" : weed = true; break;
					case "Timmy" : timmy = true; break;
					case "TerrancePhilip" : fart = true; break;
					case "Garrison" : toc = true; game.current.tocLeft = response.game.tocLeft; break;
					case "Henrietta" : game.current.scoreRight--; setScoreRight(game.current.scoreRight); break;
				}
			}
			else {
				powRight = true;
				switch (response.char) {
					case "Cartman" : game.current.hRight = response.game.hRight / 100 * window.innerWidth * 70 / 100; break;
					case "Servietsky" : weed = true; break;
					case "Timmy" : timmy = true; break;
					case "TerrancePhilip" : fart = true; break;
					case "Garrison" : toc = true; game.current.tocRight = response.game.tocRight; break;
					case "Henrietta" : game.current.scoreLeft--; setScoreLeft(game.current.scoreLeft); break;
				}
			}
		})

		socket.on("newPoint", (response) => {
			console.log(response.message);
			socket?.emit("roundStart", roomId);
		})

		socket.on("endGame", (response) => {
			console.log(response.message);
			if (id === response.winnerId) {
				const char:string = (id === game.current.idLeft ? game.current.charLeft : game.current.charRight);
				setTimeout(() => {
				  }, 1000);
				navigate('/win', {state: {char: char}});
			}
			else {
				const char:string = (id === game.current.idLeft ? game.current.charLeft : game.current.charRight);
				setTimeout(() => {
				}, 1000);
				navigate('/gameover', {state: {char: char}});
			}
		})

		socket.on("gaveUp", (response) => {
			console.log(response.message);
			if (id !== response.id)
				navigate('/errorgame');
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
				};

				p.draw = () => {
					p.clear();
					p.background('rgba(52, 52, 52, 0.75)');
					
					if (p.keyIsDown(32))
						socket?.emit("usePower", roomId, id);
					if (timmy && 
					(powLeft && game.current.charLeft == "Timmy" && id != game.current.idLeft
					|| powRight && game.current.charRight == "Timmy" && id != game.current.idRight)) {
						if (p.keyIsDown(87))
							socket?.emit("movePlayer", roomId, id, 0);
						if (p.keyIsDown(83))
							socket?.emit("movePlayer", roomId, id, 1);
					}
					else {
						if (p.keyIsDown(87))
							socket?.emit("movePlayer", roomId, id, 1);
						if (p.keyIsDown(83))
							socket?.emit("movePlayer", roomId, id, 0);
					}
					socket?.emit("moveBall", roomId);

					if (fart)
						p.fill(p.color(21, 79, 48));
					else
						p.fill(255);
					p.stroke(255);
					p.strokeWeight(1);
					p.ellipse(game.current.ball.x, game.current.ball.y, game.current.ball.rad * 2);
					p.fill(255);
					p.noStroke();
					p.rect(cDiv.clientWidth / 75, game.current.posLeft, game.current.wLeft, game.current.hLeft);
					p.rect(cDiv.clientWidth - ((cDiv.clientWidth / 75) * 2), game.current.posRight, game.current.wRight, game.current.hRight);
					
					if (toc) {
						p.fill(255);
						p.noStroke();
						if (powLeft)
							p.rect(cDiv.clientWidth / 75 * 4, game.current.tocLeft, game.current.wLeft, game.current.hLeft / 2);
						if (powRight)
							p.rect(cDiv.clientWidth - ((cDiv.clientWidth / 75) * 5), game.current.tocRight, game.current.wRight, game.current.hRight / 2);
					}
					
					if (weed) {
						p.fill('rgba(255, 255, 255, 0.95)');
						p.noStroke();
						if (powLeft)
							p.rect(cDiv.clientWidth - (cDiv.clientWidth / 3), 0, cDiv.clientWidth / 3, cDiv.clientHeight);
						if (powRight)
							p.rect(0, 0, cDiv.clientWidth / 3, cDiv.clientHeight); 
					}
				
				};

				p.windowResized = () => {
					const oldWidth:number = currentWidth;
					const oldHeight:number = currentHeight;
					cDiv = sketchRef.current!;
					currentWidth = cDiv.clientWidth;
					currentHeight = (9 / 16) * cDiv.clientWidth;
					p.resizeCanvas(cDiv.clientWidth, (9 / 16) * cDiv.clientWidth);
					const updatedGame:IGame = {
						...game.current,
						posLeft: (game.current.posLeft * (9/16) * cDiv.clientWidth / oldHeight),
						posRight: (game.current.posRight * (9/16) * cDiv.clientWidth / oldHeight),
						wLeft: game.current.wLeft * cDiv.clientWidth / oldWidth,
						hLeft: game.current.hLeft * (9/16) * cDiv.clientWidth / oldHeight,
						wRight: game.current.wRight * cDiv.clientWidth / oldWidth,
						hRight: game.current.hRight * (9/16) * cDiv.clientWidth / oldHeight,
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
				};
      		});
    	}

		return () => {
			if (game.current.scoreLeft < 5 && game.current.scoreRight < 5) {
					socket?.emit("giveUp", roomId, id);
			}
			p5SketchRef.current?.remove();
		};
	}, [sketchRef, navigate, roomId, socket]);

	return (
		<>
		<GetBg randomImage={randomImage} />
		<div id="score">{scoreLeft} - {scoreRight} </div>
		<div id="game" ref={sketchRef}></div>
		<div id="return">
			<WhatReturnButtom randomImage={randomImage} />
		</div>
		</>
	);
}