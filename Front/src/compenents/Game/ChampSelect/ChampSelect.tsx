import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import Cookie from 'js-cookie';

import "./ChampSelect.css";

import BusStop from "../../../img/backgrounds/bus_stop.jpg"
import RedCross from "../../../img/buttons/red_cross.png"

import CartmanNormal from "../../../img/characters/cartman_1.png"
import CartmanSuper from "../../../img/characters/cartman_2.jpg"

import KennyNormal from "../../../img/characters/kenny_1.png"
import KennySuper from "../../../img/characters/kenny_2.jpg"

import TerrancePhilipNormal from "../../../img/characters/terrance_philip_1.jpg"
import TerrancePhilipSuper from "../../../img/characters/terrance_philip_2.jpg"

import ServietskyNormal from "../../../img/characters/servietsky_1.jpg"
import ServietskySuper from "../../../img/characters/servietsky_2.jpg"

import TimmyNormal from "../../../img/characters/timmy_1.jpg"
import TimmySuper from "../../../img/characters/timmy_2.jpg"

import GarrisonNormal from "../../../img/characters/garrisson_1.png"
import GarrisonSuper from "../../../img/characters/garrisson_2.jpg"

import HenriettaNormal from "../../../img/characters/henrietta_1.png"
import HenriettaSuper from "../../../img/characters/henrietta_2.png"

import ButtersNormal from "../../../img/characters/butters_1.png"
import ButtersSuper from "../../../img/characters/butters_2.jpg"

// SOUNDS
import RespectezMonAutorite from "../../../sounds/phrases/Cartman_Respectez_mon_autorité.mp3"
import OnSFumeUnPetard from "../../../sounds/phrases/Servietsky On sfume un pétard .mp3"
import EwwlibleauTimmay from "../../../sounds/phrases/EwwlibleauTimmay.mp3"
import AucuneConfiance from "../../../sounds/phrases/Garrison_regles.mp3"
import JsuispastonPote from "../../../sounds/phrases/TP_je suis pas ton pote mec.mp3"
import BonjourMonsieurZizi from "../../../sounds/phrases/Butters_Bonjour monsieur zizi.mp3"
import KennyBague from "../../../sounds/phrases/Kenny La bague.mp3"
import TropConformiste from "../../../sounds/phrases/Henrietta_Danse des gothiques.mp3"

import ChooseYourFighter from "../../../img/choose_your_fighter.gif"
import choose_your_fighter from '../../../sounds/choose_your_fighter.mp3'

export default function ChampSelect() {

	const [cartman, setCartman] = useState(CartmanNormal);
	const [kenny, setKenny] = useState(KennyNormal);
	const [terrancePhilip, setTerrancePhilip] = useState(TerrancePhilipNormal);
	const [servietsky, setServietsky] = useState(ServietskyNormal);
	const [timmy, setTimmy] = useState(TimmyNormal);
	const [garrison, setGarrison] = useState(GarrisonNormal);
	const [henrietta, setHenrietta] = useState(HenriettaNormal);
	const [butters, setButters] = useState(ButtersNormal);

	const navigate = useNavigate();
	const location = useLocation();
	const token = Cookie.get('accessToken');
	if (!token)
		window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;

	const playSound = (soundFile) => {
		const audio = new Audio(soundFile);
		audio.play();
	};

	const leavePage = () => {
		if (!location.search)
			navigate(`/gamemenu`);
		else {
			navigate(`/chat`);
			window.location.reload();
		}
	};

	useEffect(() => {
		async function getUser() {
			await axios.get(
				process.env.REACT_APP_LOCAL_B + '/profile/getUserByname',
				{ withCredentials: true, params: { username: location.search.slice(location.search.lastIndexOf('=') + 1) }, headers: { "Authorization": `Bearer ${token}` } })
				.catch(error => {
					if (error.response.status === 401) {
						Cookie.remove('accessToken')
						window.location.href = "/";
					}
				})
		}
		if (location.search)
			getUser();
	})

	const handleClick = async (character: String) => {
		await axios.patch(
			process.env.REACT_APP_LOCAL_B + '/profile/setCharacter',
			{ character },
			{ withCredentials: true, headers: { "Authorization": `Bearer ${token}` } })
			.catch(error => {
				if (error.response.status === 401) {
					Cookie.remove('accessToken')
					window.location.href = "/";
				}
			})
		if (!location.search)
			navigate("/matchmaking");
		else
			navigate(`/invitematch${location.search}`)
	}

	return (
		<div className="menu">
			<iframe src={choose_your_fighter} title="choose_your_fighter_sound" allow="autoplay" id="iframeAudio"></iframe>
			<img id="bg--menu" src={BusStop} alt={'BusStop'}></img>
			<img id="red-cross" alt="red-cross" src={RedCross} onClick={leavePage}></img>
			<div id="choose_center">
				<img id="choose_your_fighter" src={ChooseYourFighter} alt={"ChooseYourFighter"}></img>
			</div>
			<div className="grid">
				<img className="card" src={cartman} alt={'Cartman'}
					onMouseEnter={() => { setCartman(CartmanSuper); }}
					onMouseLeave={() => { setCartman(CartmanNormal); }}
					onClick={() => { playSound(RespectezMonAutorite); setTimeout(() => { handleClick('Cartman') }, 2000); }}></img>
				<img className="card" src={servietsky} alt={'Servietsky'}
					onMouseEnter={() => { setServietsky(ServietskySuper); }}
					onMouseLeave={() => { setServietsky(ServietskyNormal); }}
					onClick={() => { playSound(OnSFumeUnPetard); setTimeout(() => { handleClick('Servietsky') }, 2000); }}></img>
				<img className="card" src={kenny} alt={'Kenny'}
					onMouseEnter={() => { setKenny(KennySuper); }}
					onMouseLeave={() => { setKenny(KennyNormal); }}
					onClick={() => { playSound(KennyBague); setTimeout(() => { handleClick('Kenny') }, 2000); }}></img>
				<img className="card" src={timmy} alt={'Timmy'}
					onMouseEnter={() => { setTimmy(TimmySuper); }}
					onMouseLeave={() => { setTimmy(TimmyNormal); }}
					onClick={() => { playSound(EwwlibleauTimmay); setTimeout(() => { handleClick('Timmy') }, 2000); }}></img>
				<img className="card" src={terrancePhilip} alt={'TerrancePhilip'}
					onMouseEnter={() => { setTerrancePhilip(TerrancePhilipSuper); }}
					onMouseLeave={() => { setTerrancePhilip(TerrancePhilipNormal); }}
					onClick={() => { playSound(JsuispastonPote); setTimeout(() => { handleClick('TerrancePhilip') }, 2000); }}></img>
				<img className="card" src={garrison} alt={'Garrison'}
					onMouseEnter={() => { setGarrison(GarrisonSuper); }}
					onMouseLeave={() => { setGarrison(GarrisonNormal); }}
					onClick={() => { playSound(AucuneConfiance); setTimeout(() => { handleClick('Garrison') }, 2000); }}></img>
				<img className="card" src={henrietta} alt={'Henrietta'}
					onMouseEnter={() => { setHenrietta(HenriettaSuper); }}
					onMouseLeave={() => { setHenrietta(HenriettaNormal); }}
					onClick={() => { playSound(TropConformiste); setTimeout(() => { handleClick('Henrietta') }, 2000); }}></img>
				<img className="card" src={butters} alt={'Butters'}
					onMouseEnter={() => { setButters(ButtersSuper); }}
					onMouseLeave={() => { setButters(ButtersNormal); }}
					onClick={() => { playSound(BonjourMonsieurZizi); setTimeout(() => { handleClick('Butters') }, 2000); }}></img>
			</div>
		</div>
	);
}
