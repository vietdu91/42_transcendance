import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import './SetNickname.css';

import Pass from '../../img/backgrounds/hall_monitor.png'
import RedCross from "../../img/buttons/red_cross.png"

export default function SetNickname() {
	const navigate = useNavigate();
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const token = urlParams.get('token');
	const [nickname, setNickname] = useState("");

	const handleChange = (event) => {
		setNickname(event.target.value);
	};

	const handleEnable = async (e) => {
		e.preventDefault();
		await axios.patch(
			process.env.REACT_APP_LOCAL_B + `/auth/checkNickname`, {nickname, token}, { withCredentials: true })
			.then(response => {
				navigate('/newprofile');
			})
			.catch(err => {
				console.log(err);
			});
	}

	const leavePage = () => {
		navigate(`/connect`);
	}

	return (
		<div id="TwoFA">
			<img id="TwoFA-bg" src={Pass} alt={'Pass'} />
			<img id="red-cross" src={RedCross} alt="Red Cross" onClick={leavePage} />
			<form onSubmit={handleEnable} id="TwoFA-form">
				<input className="swing" id="twofa-swing" placeholder='Show Me Your NICKNAME !' value={nickname} onChange={handleChange}></input>
				<label htmlFor="twofa-swing">Nick</label>
			</form>
		</div>
	)
}