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

export default function Profile() {

	const navigate = useNavigate();

	const token = Cookies.get('accessToken');
    if (!token)
		window.location.href = "http://localhost:3000/connect";

	const [nick, getNick] = useState("");
	const [name, getName] = useState("");
	const [age, getAge] = useState(0);
	const [pfp_url, getPfpUrl] = useState("");
	const [wins, getWins] = useState(0);
	const [looses, getLooses] = useState(0);
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
		await axios.post(
			process.env.REACT_APP_LOCAL_B + '/twofa/turn-on',
			{ code },
			{ withCredentials: true, headers: {  'Authorization': `Bearer ${token}` } })
		.then(response => {
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
			{ withCredentials: true, headers: {Authorization: `Bearer ${token}`} })
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
		// axios.get('http://localhost:3001/profile/getUser', { withCredentials: true })
		axios.get(
			process.env.REACT_APP_LOCAL_B + '/profile/getUser',
			{ withCredentials: true, headers: {Authorization: `Bearer ${token}`} })
		.then(response => {
			getNick(response.data.nick);
			getName(response.data.name);
			getAge(response.data.age);
			setTwoFa(response.data.twoFA);
			getPfpUrl(response.data.pfp_url);
			getWins(response.data.wins);
			getLooses(response.data.looses);
			getPercentage(response.data.percentage);
			const updatedGames:Game[] = [];
			const limit = response.data.games.length > 3 ? response.data.games.length - 3 : 0;
			for (let i = response.data.games.length - 1; i >= limit; i--) {
				updatedGames.push(response.data.games[i]);
				console.log(response.data.games[i]);
			}
			games.current = updatedGames;
		}).catch(error => {
			console.error(error);
		});
	
	}, [])
	
	const handleSearch = (query: string) => {
        // Effectuez votre logique de recherche ici avec la valeur 'query'
        console.log("Good SB");
        console.log(`Recherche en cours avec la requête : ${query}`);
    };
	console.log(games.current);

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
							<span className="profile-info">: {nick}</span><br/><br/> 
						</div>
						<div id="profile-info-2">
							<span className="profile-titre-infos">Nom </span>
							<span className="profile-info">: {name}</span><br/><br/> 
						</div>
						<div id="profile-info-3">
							<span className="profile-titre-infos">Win / Lose </span>
							<span className="profile-info">: {wins} / {looses}</span><br/><br/>
						</div>
						<div id="profile-info-4">
							<span className="profile-titre-infos" id="profile-titre-info-5">Votre Score </span>
							<span className="profile-info">: {percentage}%</span><br/><br/>
						</div>
						<div id="profile-info-5">
							<span className="profile-titre-infos">Age </span>
							<span className="profile-info">: {age} ans</span><br/><br/> 
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
							<span>{game.names[1]}</span></div><br/><br/></div>
							))}
					</div>
				</div>
				<div className ="pfp">
				<SearchBar2 onSearch={handleSearch}></SearchBar2>
					<img id="profile_pic" src={pfp_url} alt="PPdeMORT"></img>
					<div className="profile-buttons">
						<button className="profile-btn-1" onClick={() => navigate("/NewProfile")}><span className="profile-text-buttom">Modifier le profil 📝</span></button><br/>
						{twoFa && <><button className="twofa_off" onClick={handleDisable}>Disable 2FA 📷</button><br/></>}
						{!showFa && !twoFa && <><button className="twofa_off" onClick={generateTwoFa}>Activer le 2FA 📸</button><br/></>}
						{showFa && 
							<>
								<br/>
								<img src={qrCode}></img>
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