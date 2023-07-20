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

    

	const [hover, setHover] = useState(Town);
	const context = useContext(UserContext);


	//a modifier
	const handleClick = async () => {
		await axios.get('http://localhost:3001/Southtrans/getUser', { withCredentials: true })
		.then(response => {
			const updatedUser = {
				...context,
				id: response.data.id,
				email: response.data.email,
				name: response.data.name,
				twoFA: response.data.twoFA,
				nick: response.data.nick,
				age: response.data.age,
			}
			// setContextData()
		}).catch(error => {
			console.error('Probleme');
		});
	};

	return (
		<div id="menu">
			{WarningBox() || null}
			<img id="bg-menu" src={hover} alt={'Hell'}></img>
			<div id="menu-items">
				<div className="menu-item" onClick={() => {
					handleClick();
					window.location.href = "http://localhost:3001/southtrans/42";
				}}
				onMouseEnter={() => {setHover(Lotion);}}
				onMouseLeave={() => {setHover(Town);}}>Se connecter</div>
			</div>
		</div>
	)
}