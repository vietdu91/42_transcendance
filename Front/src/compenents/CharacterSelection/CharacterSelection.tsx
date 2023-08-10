import React from "react";
import { useState } from "react";
import Cookies from "js-cookie";

import "./CharacterSelection.css";

import BusStop from "../../img/backgrounds/bus_stop.jpg"

import CartmanNormal from "../../img/characters/cartman_1.png"
import CartmanSuper from "../../img/characters/cartman_2.jpg"

import KennyNormal from "../../img/characters/kenny_1.png"
import KennySuper from "../../img/characters/kenny_2.jpg"

import TerrancePhilipNormal from "../../img/characters/terrance_philip_1.jpg"
import TerrancePhilipSuper from "../../img/characters/terrance_philip_2.jpg"

import ServietskyNormal from "../../img/characters/servietsky_1.jpg"
import ServietskySuper from "../../img/characters/servietsky_2.jpg"

import TimmyNormal from "../../img/characters/timmy_1.jpg"
import TimmySuper from "../../img/characters/timmy_2.jpg"

import GarrisonNormal from "../../img/characters/garrisson_1.png"
import GarrisonSuper from "../../img/characters/garrisson_2.jpg"

import HenriettaNormal from "../../img/characters/henrietta_1.png"
import HenriettaSuper from "../../img/characters/henrietta_2.png"

import ButtersNormal from "../../img/characters/butters_1.png"
import ButtersSuper from "../../img/characters/butters_2.jpg"

import RespectezMonAutorite from "../../sounds/phrases/Cartman_Respectez_mon_autorité.mp3"
import OnSFumeUnPetard from "../../sounds/phrases/Servietsky On sfume un pétard .mp3"
import EwwlibleauTimmay from "../../sounds/phrases/EwwlibleauTimmay.mp3"

import ChooseYourFighter from "../../img/choose_your_fighter.gif"

export default function CharacterSelection() {

	const token = Cookies.get('accessToken');
    if (!token)
		window.location.href = "http://localhost:3000/connect";

	const [cartman, setCartman] = useState(CartmanNormal);
	const [kenny, setKenny] = useState(KennyNormal);
	const [terrancePhilip, setTerrancePhilip] = useState(TerrancePhilipNormal);
	const [servietsky, setServietsky] = useState(ServietskyNormal);
	const [timmy, setTimmy] = useState(TimmyNormal);
	const [garrison, setGarrison] = useState(GarrisonNormal);
	const [henrietta, setHenrietta] = useState(HenriettaNormal);
	const [butters, setButters] = useState(ButtersNormal);

	const playSound = (soundFile) => {
		const audio = new Audio(soundFile);
		audio.play();
	};

	return (
		<div className="menu">
			<img id="bg--menu" src={BusStop} alt={'BusStop'}></img>
			<img id="choose_your_fighter" src={ChooseYourFighter} alt={"ChooseYourFighter"}></img>
			<div className="grid">
				<img className="card" src={cartman} alt={'Cartman'}
				onMouseEnter={() => {setCartman(CartmanSuper);}}
				onMouseLeave={() => {setCartman(CartmanNormal);}}
				onClick={() => playSound(RespectezMonAutorite)}></img>
				<img className="card" src={servietsky} alt={'Servietsky'}
				onMouseEnter={() => {setServietsky(ServietskySuper);}}
				onMouseLeave={() => {setServietsky(ServietskyNormal);}}
				onClick={() => playSound(OnSFumeUnPetard)}></img>
				<img className="card" src={kenny} alt={'Kenny'}
				onMouseEnter={() => {setKenny(KennySuper);}}
				onMouseLeave={() => {setKenny(KennyNormal);}}></img>
				<img className="card" src={timmy} alt={'Timmy'}
				onMouseEnter={() => {setTimmy(TimmySuper);}}
				onMouseLeave={() => {setTimmy(TimmyNormal);}}
				onClick={() => playSound(EwwlibleauTimmay)}></img>
				<img className="card" src={terrancePhilip} alt={'TerrancePhilip'}
				onMouseEnter={() => {setTerrancePhilip(TerrancePhilipSuper);}}
				onMouseLeave={() => {setTerrancePhilip(TerrancePhilipNormal);}}></img>
				<img className="card" src={garrison} alt={'Garrison'}
				onMouseEnter={() => {setGarrison(GarrisonSuper);}}
				onMouseLeave={() => {setGarrison(GarrisonNormal);}}></img>
				<img className="card" src={henrietta} alt={'Henrietta'}
				onMouseEnter={() => {setHenrietta(HenriettaSuper);}}
				onMouseLeave={() => {setHenrietta(HenriettaNormal);}}></img>
				<img className="card" src={butters} alt={'Butters'}
				onMouseEnter={() => {setButters(ButtersSuper);}}
				onMouseLeave={() => {setButters(ButtersNormal);}}></img>
			</div>
		</div>
	);
}
