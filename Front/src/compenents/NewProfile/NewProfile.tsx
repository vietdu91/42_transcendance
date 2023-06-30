import React, { useEffect, useState }  from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import './NewProfile.css'

import Skeeter from "../../img/skeeter.gif"
import Bar from "../../img/backgrounds/skeeters-bar.jpg"

import Import from "../../compenents/utils/ImportAvatar/ImportAvatar"
import Form from "../../compenents/utils/Form/Form"
import Range from "../../compenents/utils/Range/Range"

export default function NewProfile() {

	const navigate = useNavigate();

	let [name, getName] = useState(0);
	let [nick, getNick] = useState(0);

	axios.get('http://localhost:3001/Southtrans/getUser', { withCredentials: true })
		.then(response => {
			getNick(response.data.nick);
			// getName(response.data.name);
			// getAge(response.data.age);
		}).catch(error => {
			console.error('Probleme');
		});

	useEffect (() => {
		axios.get('http://localhost:3001/Southtrans/getUser', { withCredentials: true })
		.then(response => {
			getName(response.data.name);
			getNick(response.data.nick);
		}).catch(error => {
			console.error('Probleme');
		});
		console.log(nick);
	}, [])

	const fetchData = async () => {
		await axios.get('http://localhost:3001/Southtrans/getUser', { withCredentials: true })
		.then(response => {
			getNick(response.data.nick);
			// getName(response.data.name);
			// getAge(response.data.age);
		}).catch(error => {
			console.error('Probleme');
		});
	}

	const handleClick = (e) => {
		e.preventDefault();

		fetchData();
		if (nick)
			navigate("/");
	  };

	return (
		<div id="menu">
			<img id="bg-menu" src={Bar} alt={'Bar'}></img>
			<div className="box">
				<div id="welcome">WELCOME {name}</div>
				<img id="skeeter" alt="skeeter" src={Skeeter}></img>
				<Import/>
				<Form />
				<Range />
				<button id="move_on" onClick={handleClick}></button>
			</div>
		</div>
	)
}