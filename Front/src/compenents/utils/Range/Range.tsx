import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import "./Range.css";

import Baby from '../../../img/age/0_baby_stan-0.png'
import Stan from '../../../img/age/7_stan-0.png'
import Emo from '../../../img/age/15_emo_stan-0.png'
import Evil from '../../../img/age/20_Evil_Stan-0.png'
import Future from '../../../img/age/30_stan_future-0.png'
import Randy from '../../../img/age/40_randy_marsh-0.png'
import Marvin from '../../../img/age/60_marvin_marsh-0.png'
import Death from '../../../img/age/80_death-0.png'

export default function Range() {

	const [age, setAge] = useState(0);
	const [emoji, setEmoji] = useState(Baby);


	useEffect(() => {
		if(age <= 6)
			setEmoji(Baby)
		else if (age <= 14)
			setEmoji(Stan)
		else if (age <= 19)
			setEmoji(Emo)
		else if (age <= 29)
			setEmoji(Evil)
		else if (age <= 39)
			setEmoji(Future)
		else if (age <= 59)
			setEmoji(Randy)
		else if (age <= 79)
			setEmoji(Marvin)
		else
			setEmoji(Death)
	},[age])

	const handleChange = (event) => {
		setAge(event.target.value);
	};
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(age);
		await axios
			.post(process.env.REACT_APP_LOCAL_B + '/profile/setAge', { age }, { withCredentials: true })
			.then((response) => {
				console.log(response.data.message);
			})
			.catch((error) => {
				// Gérer les erreurs de requête
			});
	}

	return (
		<form className="range" onSubmit={handleSubmit}>
			<div className="range-container">
				<img src={emoji} id="emoji" alt="Character"></img>
				<div className="range-slider-wrapper">
					<input type="range" 
					className={age > 50?'heigh':'less'}
					min='0' max='100' 
					step="1" 
					value={age}
					onChange={handleChange}/>
				</div>
				<h1>J'ai {age} {age <= 1 ? 'an' : 'ans'}</h1>
				<button type="submit" className="range-buttom">Enregistrer</button>
			</div>
		</form>
	);
}
