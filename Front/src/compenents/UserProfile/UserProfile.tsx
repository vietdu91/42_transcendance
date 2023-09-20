import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie';

import SearchBar2 from '../Profile/searchBarProfile';
import './UserProfile.css'

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

export default function UserProfile() {

	const navigate = useNavigate();

	const { username } = useParams();
	const [user, getUser] = useState(initUser);
	const [name, getName] = useState("");
	const [percentage, getPercentage] = useState(0);
	const [friend, getIsFriend] = useState(false);
	const [blocked, getIsBlocked] = useState(false);
	let games = useRef<Game[]>([]);

	const token = Cookies.get('accessToken');
	if (!token)
		window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;

	const addFriend = () => {
		console.log("TRYING TO ADD FRIEND");
		axios.post(
			process.env.REACT_APP_LOCAL_B + '/profile/addFriend',
			{ name },
			{ headers: { 'Authorization': `Bearer ${token}` }, withCredentials: true })
			.then(res => {
				getIsFriend(true);
			})
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
			{ name },
			{ headers: { 'Authorization': `Bearer ${token}` }, withCredentials: true })
			.then(response => {
				getIsFriend(false);
			})
			.catch(error => {
				console.log(error);
			})
	}

	const blockUser = () => {
		console.log("TRYING TO BLOCK USER");
		axios.post(
			process.env.REACT_APP_LOCAL_B + '/profile/addBlocked',
			{ name },
			{ headers: { 'Authorization': `Bearer ${token}` } })
			.then(response => {
				getIsFriend(false);
				getIsBlocked(true);
			})
			.catch(error => {
				console.log(error);
			})
	}

	const unblockUser = () => {
		console.log("TRYING TO UNBLOCK USER");
		axios.post(
			process.env.REACT_APP_LOCAL_B + '/profile/removeBlocked',
			{ name },
			{ headers: { 'Authorization': `Bearer ${token}` } })
			.then(response => {
				getIsBlocked(false);
			})
			.catch(error => {
				console.log(error);
			})
	}

	useEffect(() => {
		axios.get(
			process.env.REACT_APP_LOCAL_B + '/profile/getUserByName',
			{ params: { username: username }, headers: { 'Authorization': `Bearer ${token}` } })
			.then(res => {
				getUser(res.data.user);
				getName(res.data.user.name);
				getPercentage(res.data.percentage);
				getIsFriend(res.data.friend);
				getIsBlocked(res.data.blocked);
				const updatedGames: Game[] = [];
				const limit = res.data.games.length > 3 ? res.data.games.length - 3 : 0;
				for (let i = res.data.games.length - 1; i >= limit; i--) {
					updatedGames.push(res.data.games[i]);
					console.log(res.data.games[i]);
				}
				games.current = updatedGames;
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

	const handleSearch = (username: string) => {
        // Effectuez votre logique de recherche ici avec la valeur 'username'
        console.log("Good SB");
        console.log(`Recherche en cours avec la requête : ${username}`);
    };


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
							<span className="user-info">: {user.nickname}</span><br /><br />
						</div>
						<div id="user-info-2">
							<span className="user-titre-infos">Nom </span>
							<span className="user-info">: {user.name}</span><br /><br />
						</div>
						<div id="user-info-3">
							<span className="user-titre-infos">Win / Lose </span>
							<span className="user-info">: {user.wins} / {user.looses}</span><br /><br />
						</div>
						<div id="user-info-4">
							<span className="user-titre-infos" id="profile-titre-info-5">Son Score </span>
							<span className="user-info">: {percentage}%</span><br /><br />
						</div>
						<div id="user-info-5">
							<span className="user-titre-infos">Age </span>
							<span className="user-info">: {user.age} ans</span><br /><br />
						</div>
					</div>
					<img id="user-jimbo" src={Jimbo} alt="jimbo"></img>
					<div className="user-title"><h1>HIST<LetterChanger2 />RIQUE
						<span className="user-barre">Oh mon Dieu ! Il fonce droit sur nous !</span></h1></div>
					<div id="user-historique">
						{games.current.map((game, i) => (
							<div className="user-match" key={i}><div>
								<span>{game.names[0]} </span>
								<span>{game.score[0]}</span> -
								<span> {game.score[1]} </span>
								<span>{game.names[1]}</span></div></div>
						))}
					</div>
				</div>
				<div className="user_pfp">
					<img id="user_pic" src={user.pfp_url} alt="PPdeMORT"></img>
					<div className="user-buttons">
						{!friend && !blocked &&
							<button className="user-btn-1" id="user-btn-1-add" onClick={() => addFriend()}>
								Ajouter cet ami 💕
								<span></span>
								<span></span>
								<span></span>
								<span></span>
							</button>}<br />
						{friend && !blocked && <button className="user-btn-1" id="user-btn-1-remove" onClick={() => removeFriend()}>
							Supprimer cet ami 😞
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</button>}<br />
						<div className="user-btn-2-container">
						{!blocked && <><span className="user-text-buttom" id="user-txt-btn-2-bloquer">Bloquer ce gueu 🚫</span>
							<button className="user-btn-2" id="user-btn-2-bloquer" onClick={() => blockUser()}><span>Bloquer ce gueu 🚫</span></button></>}<br />
						</div>
						<div className="user-btn-2-container">
						{blocked && <><span className="user-text-buttom" id="user-txt-btn-2-debloquer">Debloquer ce gueu ✅</span>
							<button className="user-btn-2" id="user-btn-2-debloquer" onClick={() => unblockUser()}><span>Debloquer ce gueu ✅</span></button></>}<br />
						</div>
					</div>
				</div>
				<button id="going_home" onClick={() => navigate("/profile")}></button>
			</div>
		</div>
	)
}