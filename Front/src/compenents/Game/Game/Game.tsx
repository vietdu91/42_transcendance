import React, { useRef, useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import p5 from 'p5';
import { GameContext } from '../../utils/GameContext';
import Cookies from 'js-cookie';

// CSS
import './Game.css'

// COMPONENTS
import ReturnButtom from '../../utils/ReturnButtom/ReturnButtom'
import MusicPlayer from '../../../compenents/utils/MusicPlayer/MusicPlayer';

// IMG
import Chaos from '../../../img/backgrounds/backgrounds-game/chaos.jpg'
import CityWok from '../../../img/backgrounds/backgrounds-game/city_wok.jpg'
import WallMart from '../../../img/backgrounds/backgrounds-game/wallmart.jpg'
import TimmyVSJimmy from '../../../img/video/Timmy_Fights_Jimmy.mp4'
import Tron from '../../../img/backgrounds/backgrounds-game/tron.png'

// PLAYERS
import CartmanL from "../../../img/en_cours/cartman_left.png"
import CartmanR from "../../../img/en_cours/cartman_right.png"
import GarrisonL from "../../../img/en_cours/garrison_left.png"
import GarrisonR from "../../../img/en_cours/garrison_right.png"
import KennyL from "../../../img/en_cours/kenny_left.png"
import KennyR from "../../../img/en_cours/kenny_right.png"
import TimmyL from "../../../img/en_cours/timmy_left.png"
import TimmyR from "../../../img/en_cours/timmy_right.png"
import TP_L from "../../../img/en_cours/TP_left.png"
import TP_R from "../../../img/en_cours/TP_right.png"
import ButtersL from "../../../img/en_cours/butters_left.png"
import ButtersR from "../../../img/en_cours/butters_right.png"
import HenriettaL from "../../../img/en_cours/henrietta_left.png"
import HenriettaR from "../../../img/en_cours/henrietta_right.png"
import ServietskyL from "../../../img/en_cours/servietsky_left.png"
import ServietskyR from "../../../img/en_cours/servietsky_right.png"

// COMMANDES
import Touche_W from "../../../img/game/key_w.png"
import Touche_S from "../../../img/game/key_s.png"
import Touche_Space from "../../../img/game/space.png"

// GAME EFFECTS
import GeneriqueButters from "../../../img/game/videos/generique_butters.mp4"
import Gothique from "../../../img/game/videos/gothique.mp4"
import Prout from "../../../img/game/videos/prout.mp4"
import Infirme from "../../../img/game/videos/infirme.mp4"
import Sucer_une_serviette from "../../../img/game/videos/sucer_une_serviette.mp4"
import Princess_Kenny from "../../../img/game/videos/princess_kenny.mp4"
import Mr_Toc from "../../../img/game/videos/mr_toc.mp4"


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
	isActive: true,
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
		window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;
	const game = useRef(initGame);
	const socket = useContext(GameContext);
	const [scoreLeft, setScoreLeft] = useState(0);
	const [scoreRight, setScoreRight] = useState(0);

	const [OnGeneriqueButters, setOnGeneriqueButters] = useState(false);

	const [OnGothiqueLeft, setOnGothiqueLeft] = useState(false);
	const [OnGothiqueRight, setOnGothiqueRight] = useState(false);
	
	const [OnInfirmeLeft, setOnInfirmeLeft] = useState(false);
	const [OnInfirmeRight, setOnInfirmeRight] = useState(false);

	const [OnProutLeft, setOnProutLeft] = useState(false);
	const [OnProutRight, setOnProutRight] = useState(false);

	const [OnSucerLeft, setOnSucerLeft] = useState(false);
	const [OnSucerRight, setOnSucerRight] = useState(false);

	const [OnPrincessLeft, setOnPrincessLeft] = useState(false);
	const [OnPrincessRight, setOnPrincessRight] = useState(false);

	const [OnTocLeft, setOnTocLeft] = useState(false);
	const [OnTocRight, setOnTocRight] = useState(false);

	const [charLeft, setCharLeft] = useState("");
	const [charRight, setCharRight] = useState("");
	const [nameLeft, setNameLeft] = useState("");
	const [nameRight, setNameRight] = useState("");

	// BARRE DE VIE 
	let [healthLeft, setHealthLeft] = useState(5);
	let [healthRight, setHealthRight] = useState(5);

	const location = useLocation();
	if (location.state === null)
		window.location.href = "/";
	const { roomId } = location.state;
	const navigate = useNavigate();
	const p5SketchRef = useRef<p5 | null>(null);

	const sketchRef = useRef<HTMLDivElement>(null);

	console.log(p5SketchRef.current);
	console.log(game);
	const randomImage = Tron;

	const cookies = document.cookie.split('; ');
	let id: number = -1;

	for (const cookie of cookies) {
		const [name, value] = cookie.split('=');
		if (name === 'id') {
			id = Number(value);
		}
	}

	function WhatReturnButtom({ randomImage }) {
		if (randomImage === CityWok || randomImage === Chaos || randomImage === Tron)
			return (
				<ReturnButtom colorHexa='#FFFFFF' path='/' />
			)
		else
			return (
				<ReturnButtom colorHexa='#000000' path='/' />
			)
	}

	function GetBg({ randomImage }) {
		if (randomImage === TimmyVSJimmy)
			return (
				<video autoPlay muted loop className="bg opacity" src={randomImage}></video>
			)
		else
			return (
				<img className="bg" src={randomImage} alt={'bg'}></img>
			)
	}

	function ActiveGeneriqueButters() {

		setOnGeneriqueButters(true);
		setTimeout(() => {
			setOnGeneriqueButters(false)
		}, 43000);
	}
	
	function ActivePower(setter, delay) {

		setter(true);
		setTimeout(() => {setter(false)}, delay);
	}

	function DesactivePower(setter) {

		setter(false);
	}

	useEffect(() => {
		let powLeft: boolean = false;
		let powRight: boolean = false;
		let weed: boolean = false;
		let timmy: boolean = false;
		let fart: boolean = false;
		let toc: boolean = false;

		socket.on('roundStarted', (response) => {
			const updatedGame: IGame = {
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
				posLeft: (response.game.posLeft / 100 * window.innerWidth * 70 / 100),
				posRight: (response.game.posRight / 100 * window.innerWidth * 70 / 100),
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
			setCharLeft(game.current.charLeft);
			setCharRight(game.current.charRight);
			setNameLeft(response.game.nameLeft);
			setNameRight(response.game.nameRight);
			powLeft = powRight = weed = timmy = fart = toc = false;
			DesactivePower(setOnGothiqueLeft);
			DesactivePower(setOnGothiqueRight);
			DesactivePower(setOnProutLeft);
			DesactivePower(setOnProutRight);
			DesactivePower(setOnInfirmeLeft);
			DesactivePower(setOnInfirmeRight);
			DesactivePower(setOnSucerLeft);
			DesactivePower(setOnSucerRight);
			DesactivePower(setOnPrincessLeft);
			DesactivePower(setOnPrincessRight);
			DesactivePower(setOnTocLeft);
			DesactivePower(setOnTocRight);
		})

		socket.on('playerMoved', (response) => {
			const updatedGame: IGame = {
				...game.current,
				posLeft: response.posLeft / 100 * window.innerWidth * 70 / 100,
				posRight: response.posRight / 100 * window.innerWidth * 70 / 100,
			}
			game.current = updatedGame;
		})

		socket.on("ballMoved", (response) => {
			const updatedGame: IGame = {
				...game.current,
				scoreLeft: response.game.scoreLeft,
				scoreRight: response.game.scoreRight,
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
			setHealthLeft(updatedGame.scoreLeft);
			setHealthRight(updatedGame.scoreRight);
			setScoreLeft(game.current.scoreLeft);
			setScoreRight(game.current.scoreRight);
		})

		socket.on("usedPower", (response) => {
			if (response.id === game.current.idLeft) {
				powLeft = true;
				switch (response.char) {
					case "Cartman" : game.current.hLeft = response.game.hLeft / 100 * window.innerWidth * 70 / 100; break;
					case "Servietsky" : weed = true; ActivePower(setOnSucerLeft, 14000); break;
					case "Timmy" : timmy = true; ActivePower(setOnInfirmeLeft, 19000); break;
					case "TerrancePhilip" : fart = true; ActivePower(setOnProutLeft, 42000); break;
					case "Garrison" : toc = true; game.current.tocLeft = response.game.tocLeft; ActivePower(setOnTocLeft, 29000); break;
					case "Henrietta" : game.current.scoreRight--; ActivePower(setOnGothiqueLeft, 12000); setScoreRight(game.current.scoreRight); break;
					case "Butters" : ActiveGeneriqueButters(); break;
					case "Kenny" : ActivePower(setOnPrincessLeft, 51000); break;
				}
			}
			else {
				powRight = true;
				switch (response.char) {
					case "Cartman" : game.current.hRight = response.game.hRight / 100 * window.innerWidth * 70 / 100; break;
					case "Servietsky" : weed = true; ActivePower(setOnSucerRight, 14000); break;
					case "Timmy" : timmy = true; ActivePower(setOnInfirmeRight, 19000); break;
					case "TerrancePhilip" : fart = true; ActivePower(setOnProutRight, 42000); break;
					case "Garrison" : toc = true; game.current.tocRight = response.game.tocRight; ActivePower(setOnTocRight, 29000); break;
					case "Henrietta" : game.current.scoreLeft--; ActivePower(setOnGothiqueRight, 12000); setScoreLeft(game.current.scoreLeft); break;
					case "Butters" : ActiveGeneriqueButters(); break;
					case "Kenny" : ActivePower(setOnPrincessRight, 51000); break;
				}
			}
		})

		socket.on("newPoint", (response) => {
			socket?.emit('roundStart', roomId);
		})

		socket.on("endGame", (response) => {
			const updatedGame: IGame = {
				...game.current,
				isActive: false,
			}
			game.current = updatedGame;

			if (id === response.winnerId) {
				const char: string = (id === game.current.idLeft ? game.current.charLeft : game.current.charRight);
				navigate('/win', { state: { char: char } });
			}
			else if (id === game.current.idLeft || id === game.current.idRight) {
				const char: string = (id === game.current.idLeft ? game.current.charLeft : game.current.charRight);
				navigate('/gameover', { state: { char: char } });
			}
		})

		socket.on("gaveUp", (response) => {
			if (id !== response.id)
				navigate('/errorgame');
		})

		socket.on("noGame", (response) => {
			navigate("/gamemenu")
		})

		window.addEventListener('beforeunload', () => {
			socket.emit("giveUp", roomId);
		})

		if (game.current.isActive)
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
						socket?.emit("usePower", roomId);
					if (timmy &&
						((powLeft && game.current.charLeft === "Timmy" && id !== game.current.idLeft)
							|| (powRight && game.current.charRight === "Timmy" && id !== game.current.idRight))) {
						if (p.keyIsDown(87))
							socket?.emit("movePlayer", roomId, 0);
						if (p.keyIsDown(83))
							socket?.emit("movePlayer", roomId, 1);
					}
					else {
						if (p.keyIsDown(87))
							socket?.emit("movePlayer", roomId, 1);
						if (p.keyIsDown(83))
							socket?.emit("movePlayer", roomId, 0);
					}
					socket?.emit("moveBall", roomId);

					if (fart)
						p.fill(p.color(21, 79, 48));
					else
						p.fill(255);
					p.stroke(255);
					p.strokeWeight(1);
					p.ellipse(game.current.ball.x, game.current.ball.y, game.current.ball.rad * 2);
					p.noStroke();
					p.fill(102, 102, 205);
					p.stroke(0, 0, 204);
					p.strokeWeight(2);
					p.rect(cDiv.clientWidth / 75, game.current.posLeft, game.current.wLeft, game.current.hLeft);
					p.fill(204, 0, 0);
					p.stroke(153, 0, 0);
					p.strokeWeight(2);
					p.rect(cDiv.clientWidth - ((cDiv.clientWidth / 75) * 2), game.current.posRight, game.current.wRight, game.current.hRight);

					if (toc) {
						p.fill(255);
						p.noStroke();
						if (powLeft && game.current.charLeft === "Garrison")
							p.rect(cDiv.clientWidth / 75 * 4, game.current.tocLeft, game.current.wLeft, game.current.hLeft / 2);
						if (powRight && game.current.charRight === "Garrison")
							p.rect(cDiv.clientWidth - ((cDiv.clientWidth / 75) * 5), game.current.tocRight, game.current.wRight, game.current.hRight / 2);
					}

					if (weed) {
						p.fill('rgba(255, 255, 255, 0.95)');
						p.noStroke();
						if (powLeft && game.current.charLeft === "Servietsky")
							p.rect(cDiv.clientWidth - (cDiv.clientWidth / 3), 0, cDiv.clientWidth / 3, (9 / 16) * cDiv.clientWidth);
						if (powRight && game.current.charRight === "Servietsky")
							p.rect(0, 0, cDiv.clientWidth / 3, (9 / 16) * cDiv.clientWidth);
					}

				};

				p.windowResized = () => {
					const oldWidth: number = currentWidth;
					const oldHeight: number = currentHeight;
					cDiv = sketchRef.current!;
					currentWidth = cDiv.clientWidth;
					currentHeight = (9 / 16) * cDiv.clientWidth;
					p.resizeCanvas(cDiv.clientWidth, (9 / 16) * cDiv.clientWidth);
					const updatedGame: IGame = {
						...game.current,
						posLeft: (game.current.posLeft * (9 / 16) * cDiv.clientWidth / oldHeight),
						posRight: (game.current.posRight * (9 / 16) * cDiv.clientWidth / oldHeight),
						wLeft: game.current.wLeft * cDiv.clientWidth / oldWidth,
						hLeft: game.current.hLeft * (9 / 16) * cDiv.clientWidth / oldHeight,
						wRight: game.current.wRight * cDiv.clientWidth / oldWidth,
						hRight: game.current.hRight * (9 / 16) * cDiv.clientWidth / oldHeight,
						ball: {
							x: game.current.ball.x * cDiv.clientWidth / oldWidth,
							y: game.current.ball.y * (9 / 16) * cDiv.clientWidth / oldHeight,
							rad: game.current.ball.rad * (9 / 16) * cDiv.clientWidth / oldHeight,
							speed: game.current.ball.speed * cDiv.clientWidth / oldWidth,
							vx: game.current.ball.x * cDiv.clientWidth / oldWidth,
							vy: game.current.ball.y * (9 / 16) * cDiv.clientWidth / oldHeight,
						},
					}
					game.current = updatedGame;
				};
			});
		}

		return () => {
			if (game.current.scoreLeft < 5 && game.current.scoreRight < 5) {
				socket?.emit("giveUp", roomId);
			}
			p5SketchRef.current?.remove();
		};
	}, [sketchRef, navigate, roomId, socket, id]);

	function GetPlayerLeft(props) {

		let image;
		switch (props.char) {
			case "Cartman": image = CartmanL; break;
			case "Servietsky": image = ServietskyL; break;
			case "Kenny": image = KennyL; break;
			case "Timmy": image = TimmyL; break;
			case "TerrancePhilip": image = TP_L; break;
			case "Garrison": image = GarrisonL; break;
			case "Henrietta": image = HenriettaL; break;
			case "Butters": image = ButtersL; break;
		}

		if (OnGothiqueLeft)
			return (<video autoPlay src={Gothique} id="game-img-player-left"></video>);
		else if (OnProutLeft)
			return (<video autoPlay src={Prout} id="game-img-player-left"></video>);
		else if (OnInfirmeLeft)
			return (<video autoPlay src={Infirme} id="game-img-player-left"></video>);
		else if (OnSucerLeft)
			return (<video autoPlay src={Sucer_une_serviette} id="game-img-player-left"></video>);	
		else if (OnPrincessLeft)
			return (<video autoPlay src={Princess_Kenny} id="game-img-player-left"></video>);
		else if (OnTocLeft)
			return (<video autoPlay src={Mr_Toc} id="game-img-player-left"></video>);	
		else
			return (<img alt="#" src={image} id="game-img-player-left"></img>);
	}

	function GetPlayerRight(props) {

		let image;
		switch (props.char) {
			case "Cartman": image = CartmanR; break;
			case "Servietsky": image = ServietskyR; break;
			case "Kenny": image = KennyR; break;
			case "Timmy": image = TimmyR; break;
			case "TerrancePhilip": image = TP_R; break;
			case "Garrison": image = GarrisonR; break;
			case "Henrietta": image = HenriettaR; break;
			case "Butters": image = ButtersR; break;
		}

		if (OnGothiqueRight)
			return (<video autoPlay src={Gothique} id="game-img-player-right"></video>);
		else if (OnProutRight)
			return (<video autoPlay src={Prout} id="game-img-player-right"></video>);
		else if (OnInfirmeRight)
			return (<video autoPlay src={Infirme} id="game-img-player-right"></video>);
		else if (OnSucerRight)
			return (<video autoPlay src={Sucer_une_serviette} id="game-img-player-right"></video>);			
		else if (OnPrincessRight)
			return (<video autoPlay src={Princess_Kenny} id="game-img-player-right"></video>);
		else if (OnTocRight)
			return (<video autoPlay src={Mr_Toc} id="game-img-player-right"></video>);		
		else
			return (<img alt="#" src={image} id="game-img-player-right"></img>);
	}

	function FooterCommands() {

		return (
			<div id="game-commands">
				<div id="game-inner-commands">
					<span id="game-commands-bg"></span>
					<img src={Touche_W} alt="W" className="game-icon"></img>
					<span className="game-commands-font">Haut</span>
					<img src={Touche_S} alt="S" className="game-icon"></img>
					<span className="game-commands-font">Bas</span>
					<img src={Touche_Space} alt="Space" className="game-icon"></img>
					<span className="game-commands-font">Active Ton Pouvoir</span>
				</div>
			</div>
		);
	}

	function BarresDeVie(props) {

		const { nameLeft, nameRight } = props;

		const maxHealth = 5;

		if (healthLeft <= 0)
			healthLeft = 0;
		if (healthRight <= 0)
			healthRight = 0;

		const leftHealthPercent = 100 - (healthLeft / maxHealth) * 100;
		const rightHealthPercent = 100 - (healthRight / maxHealth) * 100;

		return (
			<div className="hud">
				<div className="health_container" id="player-1">
					<div className="health_meter">
						<div className="health_damage"></div>
						<div
							className="health"
							style={{ width: `${rightHealthPercent}%` }}
						></div>
						<input
							className="health_value"
							type="range"
							min="0"
							max={maxHealth}
							value={healthLeft}
							step="1"
							title=""
						/>
					</div>
					<div className="health_pseudo" id="player-1">
						{nameLeft}
					</div>
				</div>
				<div className="health_container" id="player-2">
					<div className="health_meter">
						<div className="health_damage"></div>
						<div
							className="health"
							style={{ width: `${leftHealthPercent}%` }}
						></div>
						<input
							className="health_value"
							type="range"
							min="0"
							max={maxHealth}
							value={healthRight}
							step="1"
						/>
					</div>
					<div className="health_pseudo" id="player-2">
						{nameRight}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div id="game-bg">
			<GetBg randomImage={randomImage} />
			<div id="game-player-left">
				<GetPlayerLeft char={charLeft} />
			</div>
			<div id="game-bg-score">
				<div id="game-score">
					{scoreLeft} - {scoreRight}
				</div>
			</div>
			<div id="game-container">
				<div id="game-terrain" ref={sketchRef}></div>
				{OnGeneriqueButters && (<video autoPlay className="generique_butters" src={GeneriqueButters}></video>)}
			</div>
			<div id="game-return">
				<WhatReturnButtom randomImage={randomImage} />
			</div>
			<div id="game-player-right">
				<GetPlayerRight char={charRight} />
			</div>
			<BarresDeVie nameLeft={nameLeft} nameRight={nameRight} />
			<FooterCommands />
		</div>
	);
}