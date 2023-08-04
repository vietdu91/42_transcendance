import React, { useRef, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Cookie from 'js-cookie';

import ButtersBlood from "../../../img/backgrounds/butters_blood.jpg"

import './GameMenu.css';


function SpecMenu() {
	return (
		<div id="spec-menu">
			Spectate Game
		</div>
	)
}

function PlayButton() {

	const navigate = useNavigate();

	const handleClick = () => {
		navigate("/champselect");
	}

	return (
		<button id="play-button" onClick={handleClick}>
			Jouer
		</button>
	)
}


function History() {
	return (
		<div id="history">
			Historique recent
		</div>
	)
}

export default function GameMenu() {
	const token = Cookie.get('accessToken');
	if (!token)
		window.location.href = "http://localhost:3000/connect";
		
	return (
		<div id="bg-game">
			<img id="bg-game" src={ButtersBlood} alt={'ButtersBlood'}></img>
			<SpecMenu />
			<PlayButton />
			<History />
		</div>
	)
}