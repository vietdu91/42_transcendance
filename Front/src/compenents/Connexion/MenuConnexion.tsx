import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'

// CSS
import './Connexion.css';

// PACKAGES

// COMPENENTS
import WarningBox from "../utils/WarningBox/WarningBox";
import { User, UserContext } from '../../App';


// IMG
import Town from "../../img/backgrounds/south_park_town.jpg"
import Lotion from "../../img/backgrounds/lotion.jpg"


export default function MenuConnexion() {

	async function CookieStorage() {
		console.log("app-front: CookieStorage: ");
		try {
			console.log("app-front: CookieStorage: try: ");
			const res = await axios({
				url: "http://localhost:3001/Auth/conexion",
				method: 'GET',
			}).then(response => {
				console.log("app-front: res.data.accessToken: ", response.data.accessToken 
				, "res.data.user.id: ", response.data.user.id);
				localStorage.setItem('accessToken', response.data.accessToken);
				localStorage.setItem('id', response.data.user.id.toString());
				//window.location.href = 'http://localhost:3000/newprofile';
			})
		}
		catch (err) {
			console.log("app-front: error: ", err)
		}
	}
	
	const [hover, setHover] = useState(Town);
	const context = useContext(UserContext);
	
	
	
	return (
		<div id="menu">
			{WarningBox() || null}
			<img id="bg-menu" src={hover} alt={'Hell'}></img>
			<div id="menu-items">
				<div className="menu-item" onClick={CookieStorage}
					//window.location.href = "http://localhost:3001/southtrans/42";
					onMouseEnter={() => {setHover(Lotion);}}
					onMouseLeave={() => {setHover(Town);}}>Se connecter</div>
			</div>
		</div>
	)
}