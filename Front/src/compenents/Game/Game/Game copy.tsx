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