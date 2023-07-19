import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import './Profile.css'

import { User, UserContext } from '../../App'
import Bar from "../../img/backgrounds/skeeters-bar.jpg"


export default function Profile() {
	
	const context = useContext(UserContext);
	const navigate = useNavigate();

	let [nick, getNick] = useState(0);
	let [name, getName] = useState(0);
	let [age, getAge] = useState(0);

	useEffect (() => {
		axios.get('http://localhost:3001/Southtrans/getUser', { withCredentials: true })
		.then(response => {
			getNick(response.data.nick);
			getName(response.data.name);
			getAge(response.data.age);
		}).catch(error => {
			console.error('Probleme');
		});
	}, [])

	return (
		<div id="menu">
			<img id="bg-menu" src={Bar} alt={'Bar'}></img>
			<div className="box">
				<div id="welcome">{nick} {name} {age}</div>
				<button id="move_on" onClick={() => navigate("/")}></button>
			</div>
		</div>
	)
}