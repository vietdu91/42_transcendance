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
    const [used, setUsed] = useState(false);
    const [regex, setRegex] = useState(false);

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
				// if (err.response.status === 401) {
                //     Cookie.remove('accessToken')
                //     window.location.href = "/";
                // }
                if (err.response.data.message === "wrong regex")
                {
                    setUsed(false);
                    setRegex(true);
                }
                else if (err.response.data.message === "already used")
                {
                    setUsed(true);
                    setRegex(false);
                }
			});
	}

	const leavePage = () => {
		navigate(`/connect`);
	}

	return (
        <div id="SetNickName">
            <img id="SetNickName-bg" src={JLopez} alt={'Jefferson'} />
            <img id="red-cross" src={RedCross} alt="Red Cross" onClick={leavePage} />
            <div id="SetNickName-truc">
                <form onSubmit={handleEnable} id="SetNickName-form">
                    <input className="swing" id="SetNickName-swing" placeholder='Show Me Your NickName !' value={nickname} onChange={handleChange}></input>
                    <label className="tacos" htmlFor="SetNickName-swing">🌮</label>
                </form>
                <div className="setNick_good_nickname_or_not">
                    {used && <div>Nickname deja utilise !</div>}
                    {regex && <div>Nickname invalide ! Min: 2 - Max: 20, lettres, chiffres, espace, tiret, _</div>}
                </div>       
            </div>
        </div>
	)
}