import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookie from 'js-cookie';

import './NewProfile.css'

import Skeeter from "../../img/skeeter.gif"
import Bar from "../../img/backgrounds/skeeters-bar.jpg"

import Import from "../../compenents/utils/ImportAvatar/ImportAvatar"
import Form from "../../compenents/utils/Form/Form"
import Range from "../../compenents/utils/Range/Range"

export default function NewProfile() {
	const token = Cookie.get('accessToken');
	if (!token)
		window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;

	const navigate = useNavigate();

	let [name, setName] = useState("");


	useEffect(() => {
		axios.get(
			process.env.REACT_APP_LOCAL_B + '/profile/getUser',
			{ headers: { "Authorization": `Bearer ${token}` } })
			.then(response => {
				setName(response.data.user.name);
			}).catch(error => {
				if (error.response.status === 401) {
					Cookie.remove('accessToken')
					window.location.href = "/";
				}
			});
	}, [token])

	const handleClick = async () => {
		navigate("/");
	};

	return (
		<div id="menu">
			<img id="bg-menu" src={Bar} alt={'Bar'}></img>
			<div className="box">
				<div id="welcome">WELCOME {name}</div>
				<img id="skeeter" alt="skeeter" src={Skeeter}></img>
				<Import />
				<Form />
				<Range />
				<button id="np_move_on" onClick={handleClick}></button>
			</div>
		</div>
	)
}