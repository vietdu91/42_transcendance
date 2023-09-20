import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from "js-cookie";

import './Win.css';

import CartmanWin from "../../../img/win/cartman_win.gif"
import KennyWin from "../../../img/win/kenny_win.gif"
import TimmyWin from "../../../img/win/timmy_win.gif"
import TPWin from "../../../img/win/tp_win.gif"
import ButtersWin from "../../../img/win/butters_win.gif"
import ServietskyWin from "../../../img/win/servietsky_win.gif"
import HenriettaWin from "../../../img/win/henrietta_win.gif"
import GarrisonWin from "../../../img/win/garrison_win.gif"

import RandyWin1 from "../../../img/win/randy_win_1.gif";
import RandyWin2 from "../../../img/win/randy_win_2.gif";

import RandyAgain from "../../../img/win/randy_again_1.gif"
import RandyAgain2 from "../../../img/win/randy_again_2.gif"

import YeahYeah from '../../../sounds/win_and_GO/South Park - Bono YEAH YEAH YEAAH(All Of Them).mp3'

export default function Win() {
	const token = Cookies.get('accessToken');
	if (!token)
		window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;

	const [showButtonRandy, setShowButtonRandy] = useState(false);
	const [showAgainRandy, setShowAgainRandy] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const [isButters, setIsButters] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	if (location.state == null) {
		window.location.href = "/";
	}
	const { char } = location.state;

	const whoCharacter = (char: string): string => {

		switch (char) {
			case "Cartman": return (CartmanWin);
			case "Servietsky": return (ServietskyWin);
			case "Kenny": return (KennyWin);
			case "Timmy": return (TimmyWin);
			case "TerrancePhilip": return (TPWin);
			case "Garrison": return (GarrisonWin);
			case "Henrietta": return (HenriettaWin);
			case "Butters": return (ButtersWin);
		}
		return "";
	}

	function Star() {
		return (<div className="shooting_star"></div>)
	}

	const leavePage = () => {
		navigate(`/`);
	}

	const tryagain = () => {
		navigate(`/gamemenu`);
	}

	useEffect(() => {
		const showButtonRandyDelay = 4000;
		setTimeout(() => {
			setShowButtonRandy(true);
		}, showButtonRandyDelay);
	}, []);

	useEffect(() => {
		if (char === "Butters")
			setIsButters(true);
	}, [char]);

	useEffect(() => {
		const showRandyAgainDelay = 4000;
		setTimeout(() => {
			setShowAgainRandy(true);
		}, showRandyAgainDelay);
	}, []);

	const handleMouseEnter = () => {
		setIsHovering(true);
	};

	const handleMouseLeave = () => {
		setIsHovering(false);
	};

	useEffect(() => {
		const showImageDelay = 3000;
		setTimeout(() => {
			const bgWin = document.getElementById('bg-win');
			bgWin?.classList.add('show-image');
		}, showImageDelay);
	}, []);

	return (
		<div id="bg-win">
			<iframe title="YeahYeah_sound" src={YeahYeah} allow="autoplay" id="iframeAudio"></iframe>
			<div className="stars">
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
				<Star />
			</div>
			{showButtonRandy && (
				<img
					id="button-randy-win"
					alt="#"
					src={isHovering ? RandyWin2 : RandyWin1}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onClick={leavePage}
				/>
			)}
			{showAgainRandy && (
				<img
					id="garrison_again"
					alt="#"
					src={isHovering ? RandyAgain2 : RandyAgain}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onClick={tryagain}
				/>
			)}
			<div id="victoire">T'ES UN WINNER !</div>
			{!isButters && (<img id="img_win" alt="win" src={whoCharacter(char)}></img>)}
			{isButters && (<img id="img_win_butters" alt="win" src={whoCharacter(char)}></img>)}
		</div>
	)
}
