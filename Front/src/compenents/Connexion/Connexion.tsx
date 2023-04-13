import React from 'react'

// CSS
import './Connexion.css';

// PACKAGES
import { useNavigate } from "react-router-dom";

// COMPENENTS
import WarningBox from "../utils/WarningBox/WarningBox";

// IMG
import Town from "../../img/south_park_town.jpg"
import Lotion from "../../img/lotion.jpg"


export default function Connexion() {

	const [hover, setHover] = React.useState(Town);
	const navigate = useNavigate();

	return (
		<div id="menu">
			<WarningBox />
			<img id="bg-menu" src={hover} alt={'Hell'}></img>
			<div id="menu-items">
		  		<div className="menu-item" onClick={() => navigate("/")} onMouseEnter={() => {setHover(Lotion);}}
		  		onMouseLeave={() => {setHover(Town);}}>Se connecter</div>
			</div>
		</div>
	)
}
