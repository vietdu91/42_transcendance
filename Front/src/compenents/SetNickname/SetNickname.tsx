import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import './SetNickname.css';

import JLopez from '../../img/backgrounds/jennifer.jpg'
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
				window.location.reload();
			})
			.catch(err => {
				console.log(err);
			});
	}

	const leavePage = () => {
		navigate(`/connect`);
	}

	return (
        <div id="SetNickName">
            <img id="SetNickName-bg" src={JLopez} alt={'Jefferson'} />
            <img id="red-cross" src={RedCross} alt="Red Cross" onClick={leavePage} />
            <form onSubmit={handleEnable} id="SetNickName-form">
                <input className="swing" id="SetNickName-swing" placeholder='Show Me Your NickName !' value={code} onChange={handleChange}></input>
                <label htmlFor="SetNickName-swing">2FA</label>
            </form>
        </div>
	)
}