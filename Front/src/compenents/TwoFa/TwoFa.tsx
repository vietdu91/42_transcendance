import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Cookie from 'js-cookie'

import './TwoFa.css';

import Pass from '../../img/backgrounds/hall_monitor.png'
import RedCross from "../../img/buttons/red_cross.png"

export default function TwoFa() {
	const navigate = useNavigate();
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const id = urlParams.get('id');
	const [code, setCode] = useState("");

	const handleChange = (event) => {
		setCode(event.target.value);
	};

	const handleEnable = async (e) => {
		e.preventDefault();
		await axios.get(
			process.env.REACT_APP_LOCAL_B + `/auth/connect2fa?code=${code}&id=${Number(id)}`, { withCredentials: true })
			.then(response => {
				navigate('/');
			})
			.catch(err => {
				if (err.response.status === 401) {
                    Cookie.remove('accessToken')
                    window.location.href = "/";
                }
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
				<input className="swing" id="twofa-swing" placeholder='Show Me Your HALLPASS !' value={code} onChange={handleChange}></input>
				<label htmlFor="twofa-swing">2FA</label>
			</form>
		</div>
	)
}