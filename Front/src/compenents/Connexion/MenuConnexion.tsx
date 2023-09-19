import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'

// CSS
import './Connexion.css';

// PACKAGES

// COMPENENTS
import WarningBox from "../utils/WarningBox/WarningBox";


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