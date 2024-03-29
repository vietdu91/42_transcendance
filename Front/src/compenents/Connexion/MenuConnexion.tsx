import React, { useState } from 'react'

// CSS
import './Connexion.css';

// PACKAGES

// COMPENENTS
import WarningBox from "../utils/WarningBox/WarningBox";

import southparkSound from '../../sounds/theme_song.mp3'
import Tab from '../utils/Tab/Tab'

// IMG
import Town from "../../img/backgrounds/south_park_town.jpg"
import Lotion from "../../img/backgrounds/lotion.jpg"

export default function MenuConnexion() {
	

	async function CookieStorage() {
		window.location.href = `${process.env.REACT_APP_LOCAL_B}/southtrans/42`;
	}

	const [hover, setHover] = useState(Town);
	
	return (
		<div id="menu">
			<iframe src={southparkSound} title="sps" allow="autoplay" id="iframeAudio">
			</iframe> 
			<Tab sound={southparkSound} delay={0}/>
			{WarningBox() || null}
			<img id="bg-menu" src={hover} alt={'Hell'}></img>
			<div id="menu-items">
				<div className="menu-item" onClick={CookieStorage}
					onMouseEnter={() => {setHover(Lotion);}}
					onMouseLeave={() => {setHover(Town);}}>Se connecter</div>
			</div>
		</div>
	)
}