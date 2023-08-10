import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';

import "./ChampSelect.css";

import BusStop from "../../../img/backgrounds/bus_stop.jpg"

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

import RespectezMonAutorite from "../../../sounds/phrases/Cartman_Respectez_mon_autorité.mp3"
import OnSFumeUnPetard from "../../../sounds/phrases/Servietsky On sfume un pétard .mp3"
import EwwlibleauTimmay from "../../../sounds/phrases/EwwlibleauTimmay.mp3"

import ChooseYourFighter from "../../../img/choose_your_fighter.gif"

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
	const token = Cookies.get('accessToken');
    if (!token)
        window.location.href = "http://localhost:3000/connect";

	const playSound = (soundFile) => {
		const audio = new Audio(soundFile);
		audio.play();
	};

	const handleClick = async (character:String) => {
		await axios
			.post('http://localhost:3001/SouthTrans/setCharacter', { character }, { withCredentials: true })
			.then((response) => {
				console.log(response.data.message);
			})
			.catch((error) => {
				console.error(error);
			});
		navigate("/matchmaking");
	}

	return (
		<div className="menu">
			<img id="bg--menu" src={BusStop} alt={'BusStop'}></img>
			<div id="choose_center">
				<img id="choose_your_fighter" src={ChooseYourFighter} alt={"ChooseYourFighter"}></img>
			</div>
			<div className="grid">
				<img className="card" src={cartman} alt={'Cartman'}
				onMouseEnter={() => {setCartman(CartmanSuper);}}
				onMouseLeave={() => {setCartman(CartmanNormal);}}
				onClick={() => {playSound(RespectezMonAutorite); setTimeout(() => {handleClick('Cartman')}, 1000);}}></img>
				<img className="card" src={servietsky} alt={'Servietsky'}
				onMouseEnter={() => {setServietsky(ServietskySuper);}}
				onMouseLeave={() => {setServietsky(ServietskyNormal);}}
				onClick={() => {playSound(OnSFumeUnPetard); setTimeout(() => {handleClick('Servietsky')}, 1000);}}></img>
				<img className="card" src={kenny} alt={'Kenny'}
				onMouseEnter={() => {setKenny(KennySuper);}}
				onMouseLeave={() => {setKenny(KennyNormal);}}
				onClick={() => {playSound(OnSFumeUnPetard); setTimeout(() => {handleClick('Kenny')}, 1000);}}></img>
				<img className="card" src={timmy} alt={'Timmy'}
				onMouseEnter={() => {setTimmy(TimmySuper);}}
				onMouseLeave={() => {setTimmy(TimmyNormal);}}
				onClick={() => {playSound(EwwlibleauTimmay); setTimeout(() => {handleClick('Timmy')}, 1000);}}></img>
				<img className="card" src={terrancePhilip} alt={'TerrancePhilip'}
				onMouseEnter={() => {setTerrancePhilip(TerrancePhilipSuper);}}
				onMouseLeave={() => {setTerrancePhilip(TerrancePhilipNormal);}}
				onClick={() => {playSound(OnSFumeUnPetard); setTimeout(() => {handleClick('TerrancePhilip')}, 1000);}}></img>
				<img className="card" src={garrison} alt={'Garrison'}
				onMouseEnter={() => {setGarrison(GarrisonSuper);}}
				onMouseLeave={() => {setGarrison(GarrisonNormal);}}
				onClick={() => {playSound(OnSFumeUnPetard); setTimeout(() => {handleClick('Garrison')}, 1000);}}></img>
				<img className="card" src={henrietta} alt={'Henrietta'}
				onMouseEnter={() => {setHenrietta(HenriettaSuper);}}
				onMouseLeave={() => {setHenrietta(HenriettaNormal);}}
				onClick={() => {playSound(OnSFumeUnPetard); setTimeout(() => {handleClick('Henrietta')}, 1000);}}></img>
				<img className="card" src={butters} alt={'Butters'}
				onMouseEnter={() => {setButters(ButtersSuper);}}
				onMouseLeave={() => {setButters(ButtersNormal);}}
				onClick={() => {playSound(OnSFumeUnPetard); setTimeout(() => {handleClick('Butters')}, 1000);}}></img>
			</div>
		</div>
	);
}
