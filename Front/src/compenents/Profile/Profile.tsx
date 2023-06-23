import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import './Profile.css'

import UserContext from '../../App'
import Bar from "../../img/backgrounds/skeeters-bar.jpg"


export default function Profile() {
	
	// const context = useContext(UserContext);
	const navigate = useNavigate();

	let [nick, getNick] = useState([]);
	let [name, getName] = useState([]);

	useEffect (() => {
		axios.get('http://localhost:3001/Southtrans/getNickname', { withCredentials: true })
		.then(response => {
			getNick(response.data.nick);
			getName(response.data.name);
		}).catch(error => {
			console.error('Probleme');
		});
	}, [])
	return (
		<div id="menu">
			<img id="bg-menu" src={Bar} alt={'Bar'}></img>
			<div className="box">
				<div id="welcome">{nick} {name}</div>
				<button id="move_on" onClick={() => navigate("/")}></button>
			</div>
		</div>
	)
}