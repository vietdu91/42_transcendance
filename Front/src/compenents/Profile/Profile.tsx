import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie';

import './Profile.css'

import Bar from "../../img/backgrounds/skeeters-bar.jpg"


export default function Profile() {

	const navigate = useNavigate();

	const token = Cookies.get('accessToken');
    if (!token)
		window.location.href = "http://localhost:3000/connect";

	let [nick, getNick] = useState("");
	let [name, getName] = useState("");
	let [age, getAge] = useState(0);
	let [pfp_url, getPfpUrl] = useState("");
	let [wins, getWins] = useState(0);
	let [looses, getLooses] = useState(0);
	let [percentage, getPercentage] = useState(0);
	let [qrCode, setQrCode] = useState("");
	let [showFa, setShowFa] = useState(false);
	let [twoFa, setTwoFa] = useState(false);
	let [code, setCode] = useState("");
	
	async function generateTwoFa() {
		await axios.get(process.env.REACT_APP_LOCAL_B + '/twofa/generate', {headers: {  'Authorization': `Bearer ${token}` }},)
		.then(response => {
			console.log("respond === " + response.data.code);
			setShowFa(true);
			setQrCode(response.data.code);
		})
		.catch(err => {
			console.log("app-front: error: ", err)
		})
	}

	const handleChange = (event) => {
		setCode(event.target.value);
	  };

	const handleEnable = async (e) => {
		console.log(code);
		// e.preventDefault();
		await axios.post(process.env.REACT_APP_LOCAL_B + '/twofa/turn-on', { code }, { withCredentials: true, headers: {  'Authorization': `Bearer ${token}` } })
		.then(response => {
		})
		.catch(err => {
			console.log(err);
		})
	}

	async function handleDisable() {
		const state:boolean = false;
		await axios.patch(process.env.REACT_APP_LOCAL_B + '/profile/disableTwoFA', {state}, {withCredentials: true})
		.then(response => {

		})
		.catch(err => {
			console.log(err);
		})
	}

	useEffect (() => {
		// axios.get('http://localhost:3001/profile/getUser', { withCredentials: true })
		axios.get(process.env.REACT_APP_LOCAL_B + '/profile/getUser', { withCredentials: true })
		.then(response => {
			getNick(response.data.nick);
			getName(response.data.name);
			getAge(response.data.age);
			setTwoFa(response.data.twoFA);
			getPfpUrl(response.data.pfp_url);
			getWins(response.data.wins);
			getLooses(response.data.looses);
			getPercentage(response.data.percentage);
		}).catch(error => {
			console.error(error);
		});
	
	}, [])

	return (
		<div id="menu">
			<img id="bg-menu" src={Bar} alt={'Bar'}></img>

			<div className
			="box2">
				<p>CONTENT</p>

				<div id="welcome2">
					{/* <div id="eric">
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
					</div> */}
					<div id="profile_font">PROFIL</div>
					<div>	
							Nick : ({nick})<br/><br/> 
							Name : ({name})<br/><br/> 
							Age: ({age})<br/><br/>
							W/L : {wins} / {looses} ({percentage}%)<br/><br/>
					</div>
				</div>
					<p>CONTENT</p>	
				<div className ="pfp">
					<img id="profile_pic" src={pfp_url} alt="PPdeMORT"></img>
					<div className="buttons">
						<button className="btn-hover color-1" onClick={() => navigate("/NewProfile")}>Changer d'image</button><br/>
						<button className="btn-hover color-2" onClick={() => navigate("/NewProfile")}>Changer de pseudo</button><br/>
						<button className="btn-hover color-3" onClick={() => navigate("/NewProfile")}>Changer d'age</button><br/>
						{twoFa && <><button className="twofa_on" onClick={handleDisable}>Disable 2FA</button><br/></>}
						{!showFa && !twoFa && <><button className="twofa_off" onClick={generateTwoFa}>Enable 2FA</button><br/></>}
						{showFa && 
							<>
								<br/>
								<img src={qrCode}></img>
								<form onSubmit={handleEnable}>
									<input placeholder='code' value={code} onChange={handleChange}></input>
								</form>
							</>
						}
					</div>
				</div>
				<button id="move_on" onClick={() => navigate("/")}></button>
			</div>
		</div>
	)
}