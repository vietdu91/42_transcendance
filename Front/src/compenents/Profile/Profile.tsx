import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie';

import './Profile.css'
import '../searchBar/searchBar.css'
import SearchBar2 from './searchBarProfile';

import Missing from "../../img/backgrounds/missing_profile.jpg"
import Jimbo from "../../img/characters/shoot-jimbo.gif"

interface Game {
	names: string[],
	score: number[],
	date: Date,
}

const initUser = {
	name: "",
	nickname: "",
	age: 0,
	pfp_url: "",
	wins: 0,
	looses: 0,
}

export default function Profile() {

	const navigate = useNavigate();

	const token = Cookies.get('accessToken');
    if (!token)
		window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;

	const [user, getUser] = useState(initUser);
	const [percentage, getPercentage] = useState(0);
	const [qrCode, setQrCode] = useState("");
	const [showFa, setShowFa] = useState(false);
	const [twoFa, setTwoFa] = useState(false);
	const [code, setCode] = useState("");
	let games = useRef<Game[]>([]);
	
	async function generateTwoFa() {
		await axios.get(
			process.env.REACT_APP_LOCAL_B + '/twofa/generate',
			{headers: {  'Authorization': `Bearer ${token}` }})
		.then(response => {
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
		// console.log(code);
		e.preventDefault();
		await axios.post(
			process.env.REACT_APP_LOCAL_B + '/twofa/turn-on',
			{ code },
			{ withCredentials: true, headers: {  'Authorization': `Bearer ${token}` } })
		.then(response => {
			setShowFa(false);
			setTwoFa(true);
		})
		.catch(err => {
			console.log(err);
		})
	}

	async function handleDisable() {
		const state:boolean = false;
		await axios.patch(
			process.env.REACT_APP_LOCAL_B + '/profile/disableTwoFA',
			{state},
			{ withCredentials: true, headers: {"Authorization": `Bearer ${token}`} })
		.then(response => {
			setTwoFa(false);
			setShowFa(false);
		})
		.catch(err => {
			console.log(err);
		})
	}

	const LetterChanger2 = () => {
		const [currentLetter, setCurrentLetter] = useState('A');
		
		useEffect(() => {
		  	const interval = setInterval(() => {
			const alphabet = 'QWERTYUIOPASDFGHJKLZXCVBNM';
			const currentIndex = alphabet.indexOf(currentLetter);
			const nextIndex = (currentIndex + 1) % alphabet.length;
			const nextLetter = alphabet[nextIndex];
			
			setCurrentLetter(nextLetter);
		  }, 1000);
	  
		  return () => clearInterval(interval);
		}, [currentLetter]);
	  
		return (
		  <span id="profile-south">{currentLetter}</span>
		);
	  }

	const LetterChanger = () => {
		const [currentLetter, setCurrentLetter] = useState('A');
		
		useEffect(() => {
		  	const interval = setInterval(() => {
			const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			const currentIndex = alphabet.indexOf(currentLetter);
			const nextIndex = (currentIndex + 1) % alphabet.length;
			const nextLetter = alphabet[nextIndex];
			
			setCurrentLetter(nextLetter);
		  }, 1000);
	  
		  return () => clearInterval(interval);
		}, [currentLetter]);
	  
		return (
		  <span id="profile-south">{currentLetter}</span>
		);
	  }


	useEffect (() => {
		axios.get(
			process.env.REACT_APP_LOCAL_B + '/profile/getUser',
			{ headers: {"Authorization": `Bearer ${token}`} })
		.then(res => {
			getUser({
				name: res.data.user.name,
				nickname: res.data.user.nickname,
				age: res.data.user.age,
				pfp_url: res.data.user.pfp_url,
				wins: res.data.user.wins,
				looses: res.data.user.looses,
			});
			setTwoFa(res.data.user.twoFactorEnabled);
			getPercentage(res.data.percentage)
			const updatedGames:Game[] = [];
			const limit = res.data.games.length > 3 ? res.data.games.length - 3 : 0;
			for (let i = res.data.games.length - 1; i >= limit; i--) {
				updatedGames.push(res.data.games[i]);
				console.log(res.data.games[i]);
			}
			games.current = updatedGames;
		}).catch(error => {
			console.error(error);
		});
	
	}, [token])
	
	const handleSearch = (username: string) => {
        // Effectuez votre logique de recherche ici avec la valeur 'username'
        console.log("Good SB");
        console.log(`Recherche en cours avec la requête : ${username}`);
    };

	return (
		<div id="profile-menu">
			<img id="profile-bg-menu" src={Missing} alt={'Missing'}></img>
			<div className="box2">
				<div id="profile-text">
					<div id="profile-hardly-brothers"></div>
					<div className="profile-title">
						<h1>PR<LetterChanger />FIL<span className="barre">Moi j'ai un indice colossal</span></h1></div>
					<div className="profile-infos">	
						<div id="profile-info-1">
							<span className="profile-titre-infos">Pseudo </span>
							<span className="profile-info">: {user.nickname}</span><br/><br/> 
						</div>
						<div id="profile-info-2">
							<span className="profile-titre-infos">Nom </span>
							<span className="profile-info">: {user.name}</span><br/><br/> 
						</div>
						<div id="profile-info-3">
							<span className="profile-titre-infos" id="profile-titre-info-5">Win / Lose </span>
							<span className="profile-info">: {user.wins} / {user.looses}</span><br/><br/>
						</div>
						<div id="profile-info-4">
							<span className="profile-titre-infos" id="profile-titre-info-5">Votre Score </span>
							<span className="profile-info">: {percentage}%</span><br/><br/>
						</div>
						<div id="profile-info-5">
							<span className="profile-titre-infos">Age </span>
							<span className="profile-info">: {user.age} ans</span><br/><br/> 
						</div>
					</div>
					<img id="profile-jimbo" src={Jimbo} alt="jimbo"></img>
					<div className="profile-title"><h1>HIST<LetterChanger2 />RIQUE
					<span className="barre">Oh mon Dieu ! Il fonce droit sur nous !</span></h1></div>
					<div id="profile-historique">
						{games.current.map((game, i) => (
							<div className="profile-match" key={i}><div>
							<span>{game.names[0]} </span> 
							<span>{game.score[0]}</span> - 
							<span> {game.score[1]} </span> 
							<span>{game.names[1]}</span></div></div>
							))}
					</div>
				</div>
				<div className ="pfp">
				<SearchBar2 onSearch={handleSearch}></SearchBar2>
					<img id="profile_pic" src={user.pfp_url} alt="PPdeMORT"></img>
					<div className="profile-buttons">
						<button className="profile-btn-1" onClick={() => navigate("/NewProfile")}><span className="profile-text-buttom">Modifier le profil 📝</span></button><br/>
						{twoFa && <><button className="twofa_off" onClick={handleDisable}>Disable 2FA 📷</button><br/></>}
						{!showFa && !twoFa && <><button className="twofa_off" onClick={generateTwoFa}>Activer le 2FA 📸</button><br/></>}
						{showFa && 
							<>
								<br/>
								<img src={qrCode} alt="qrcode"></img>
								<form onSubmit={handleEnable}>
									<input placeholder='Show Me Your HALLPASS' value={code} onChange={handleChange}></input>
								</form>
							</>
						}
					</div>
				</div>
				<button id="going_home" onClick={() => navigate("/")}></button>
			</div>
		</div>
	)
}