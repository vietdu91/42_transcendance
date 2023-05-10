import React from "react";
import { useState, useEffect } from "react";
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

	const [data, setData] = useState(0);
	const [emoji, setEmoji] = useState(Baby);

	useEffect(() => {
		if(data <= 6)
			setEmoji(Baby)
		else if (data <= 14)
			setEmoji(Stan)
		else if (data <= 19)
			setEmoji(Emo)
		else if (data <= 29)
			setEmoji(Evil)
		else if (data <= 39)
			setEmoji(Future)
		else if (data <= 59)
			setEmoji(Randy)
		else if (data <= 79)
			setEmoji(Marvin)
		else
			setEmoji(Death)
	},[data])

	const handleChange = (event) => {setData(event.target.value);};

	return (
		<div className="range">
			<img src={emoji} id="emoji" alt="Character"></img>
			<div className="range-slider-wrapper">
				<input type="range" className={data > 50?'heigh':'less'}
				min='0' max='100' step="1" value={data}
				onChange={handleChange}/>
			</div>
			<h1>J'ai {data} {data <= 1 ? 'an' : 'ans'}</h1>
		</div>
	);
}
