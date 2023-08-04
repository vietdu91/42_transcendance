import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie';


import './Profile.css'

import { User, UserContext } from '../../App'
import Bar from "../../img/backgrounds/skeeters-bar.jpg"


export default function Profile() {
	
	const context = useContext(UserContext);
	const navigate = useNavigate();

	const token = Cookies.get('accessToken');
    if (!token)
		window.location.href = "http://localhost:3000/connect";

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

			<div className
			="box2">
				<p>CONTENT</p>

				<div id="welcome2">
					<div id="eric">
						<div className="face">
							<div className="hat"></div>
							<div className="eye-left"></div>
							<div className="eye-right"></div>
							<div className="smile"></div>
						</div>
						<div className="body">
							<div className="zipper"></div>
							<div className="button-1"></div>
							<div className="button-2"></div>
							<div className="button-3"></div>
							<div className="hand-left"></div>
							<div className="hand-right"></div>
						</div>
						<div className="legs">
							<div className="foot-left"></div>
							<div className="foot-right"></div>
						</div>
					</div>
						<div id="profile_font">PROFIL</div>
						<div>	Nick : ({nick})<br/><br/> 
								Name : ({name})<br/><br/> 
								Age: ({age})<br/><br/>
						</div>
				</div>
					<p>CONTENT</p>
				<div className ="pfp">
					<img src="https://media.giphy.com/media/26gJyImHbhEfKyem4/giphy.gif" alt="PPdeMORT"></img>
					<div className="buttons">
						<button className="btn-hover color-1" onClick={() => navigate("/NewProfile")}>Changer d'image</button><br/>
						<button className="btn-hover color-2" onClick={() => navigate("/NewProfile")}>Changer de pseudo</button><br/>
						<button className="btn-hover color-3" onClick={() => navigate("/NewProfile")}>Changer d'age</button><br/></div>
				</div>
				<button id="move_on" onClick={() => navigate("/")}></button>
			</div>
		</div>
	)
}