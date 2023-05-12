import React from "react";

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

import RespectezMonAutorite from "../../sounds/phrases/Cartman_Respectez_mon_autorité.mp3"
import OnSFumeUnPetard from "../../sounds/phrases/Servietsky On sfume un pétard .mp3"
import EwwlibleauTimmay from "../../sounds/phrases/EwwlibleauTimmay.mp3"

export default function CharacterSelection() {

	const [cartman, setCartman] = React.useState(CartmanNormal);
	const [kenny, setKenny] = React.useState(KennyNormal);
	const [terrancePhilip, setTerrancePhilip] = React.useState(TerrancePhilipNormal);
	const [servietsky, setServietsky] = React.useState(ServietskyNormal);
	const [timmy, setTimmy] = React.useState(TimmyNormal);

	const playSound = (soundFile) => {
		const audio = new Audio(soundFile);
		audio.play();
	};

	return (
		<div className="menu">
			<img id="bg--menu" src={BusStop} alt={'BusStop'}></img>
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
				<div className="card">Perso 6</div>
				<div className="card">Perso 7</div>
				<div className="card">Perso 8</div>
			</div>
		</div>
	);
}
