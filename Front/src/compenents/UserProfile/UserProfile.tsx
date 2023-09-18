import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie';

import SearchBar2 from '../Profile/searchBarProfile';
import './UserProfile.css'

import Missing from "../../img/backgrounds/missing_profile.jpg"
import Jimbo from "../../img/characters/shoot-jimbo.gif"

export default function UserProfile() {

	const navigate = useNavigate();

	const { username } = useParams();
	const [id, getId] = useState(0);
	const [nick, getNick] = useState("");
	const [name, getName] = useState("");
	const [age, getAge] = useState(0);
	const [pfp_url, getPfpUrl] = useState("");
	const [wins, getWins] = useState(0);
	const [looses, getLooses] = useState(0);
	const [percentage, getPercentage] = useState(0);
	
	const token = Cookies.get('accessToken');
    const userId = Cookies.get('id');
	if (!token)
		window.location.href = "http://localhost:3000/connect";

// Si on ajoute un ami, il faudrait un pop up pour accepter
// Ajouter la fonction de check ami deja ajoute
	const addFriend = () => {
		console.log("TRYING TO ADD FRIEND");
		axios.post(
			process.env.REACT_APP_LOCAL_B + '/profile/addFriend',
			{name},
			{headers: {  'Authorization': `Bearer ${token}`}, withCredentials: true })
		.then(response => {})
		.catch(error => {
			console.log(error);
		})
	}

// Si je remove friend, l'autre ne l'a plus en ami non plus
// Ajouter la fonction de check ami deja supprime
	const removeFriend = () => {
		console.log("TRYING TO REMOVE FRIEND");
		axios.post(
			process.env.REACT_APP_LOCAL_B + '/profile/removeFriend',
			{name},
			{headers: {  'Authorization': `Bearer ${token}`}, withCredentials: true })
		.then(response => {})
		.catch(error => {
			console.log(error);
		})
	}

	useEffect(() => {
		axios.get(
			process.env.REACT_APP_LOCAL_B + '/profile/getUserByName',
			{params: {username: username}, headers: {  'Authorization': `Bearer ${token}`}})
		.then(response => {
			if (userId == response.data.id) {
				navigate("/profile");
				return (<></>)
			}
			getId(response.data.id)
			getNick(response.data.nick)
			getName(response.data.name)
			getAge(response.data.age)
			getPfpUrl(response.data.pfp_url)
		})
		.catch(error => {
			navigate("/profile");
		})
	}, []);

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

	return (
		<div id="user-menu">
			<img id="user-bg-menu" src={Missing} alt={'Missing'}></img>
			<div className="user-box2">
				<div id="user-text">
					<div id="user-hardly-brothers"></div>
					<div className="user-title">
						<h1>PR<LetterChanger />FIL<span className="user-barre">Moi j'ai un indice colossal</span></h1></div>
					<div className="user-infos">	
						<div id="user-info-1">
							<span className="user-titre-infos">Pseudo </span>
							<span className="user-info">: {nick}</span><br/><br/> 
						</div>
						<div id="user-info-2">
							<span className="user-titre-infos">Nom </span>
							<span className="user-info">: {name}</span><br/><br/> 
						</div>
						<div id="user-info-3">
							<span className="user-titre-infos">Win / Lose </span>
							<span className="user-info">: {wins} / {looses}</span><br/><br/>
						</div>
						<div id="user-info-4">
							<span className="user-titre-infos" id="profile-titre-info-5">Son Score </span>
							<span className="user-info">: {percentage}%</span><br/><br/>
						</div>
						<div id="user-info-5">
							<span className="user-titre-infos">Age </span>
							<span className="user-info">: {age} ans</span><br/><br/> 
						</div>
					</div>
						<img id="user-jimbo" src={Jimbo} alt="jimbo"></img>
						<div className="user-title"><h1>HIST<LetterChanger2 />RIQUE
						<span className="user-barre">Oh mon Dieu ! Il fonce droit sur nous !</span></h1></div>
					{/* <div id="user-historique">
						{games.current.map((game, i) => (
							<div className="user-match" key={i}><div>
							<span>{game.names[0]} </span> 
							<span>{game.score[0]}</span> - 
							<span> {game.score[1]} </span> 
							<span>{game.names[1]}</span></div><br/><br/></div>
							))}
					</div> */}
				</div>
				<div className ="user_pfp">
				{/* <SearchBar2 onSearch={handleSearch}></SearchBar2> */}
					<img id="user_pic" src={pfp_url} alt="PPdeMORT"></img>
					<div className="user-buttons">
						<button className="user-btn-1" onClick={() => addFriend()}><span className="profile-text-buttom">Ajouter cet ami 💕</span></button><br/>
						{/* <button className="user-btn-1" onClick={() => removeFriend()}><span className="profile-text-buttom">Supprimer cet ami 😞</span></button><br/> */}
						<button className="user-btn-1" onClick={() => removeFriend()}><span className="profile-text-buttom">Bloquer ce gueu 🚫</span></button><br/>
						{/* <button className="user-btn-1" onClick={() => removeFriend()}><span className="profile-text-buttom">Debloquer ce gueu ✅</span></button><br/> */}
					</div>
				</div>
				<button id="going_home" onClick={() => navigate("/")}></button>
			</div>
		</div>
	)
}