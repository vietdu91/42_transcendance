import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie';

import './UserProfile.css'

import Bar from "../../img/backgrounds/skeeters-bar.jpg"

export default function UserProfile() {

	const navigate = useNavigate();
	let { username } = useParams();
	let [id, getId] = useState(0);
	let [nick, getNick] = useState("");
	let [name, getName] = useState("");
	let [age, getAge] = useState(0);
	let [pfp_url, getPfpUrl] = useState("");
	
	const token = Cookies.get('accessToken');
    const userId = Cookies.get('id');
	if (!token)
		window.location.href = "http://localhost:3000/connect";

// Si on ajoute un ami, il faudrait un pop up pour accepter
// Ajouter la fonction de check ami deja ajoute
	const addFriend = () => {
		console.log("TRYING TO ADD FRIEND");
		axios.post(process.env.REACT_APP_LOCAL_B + '/profile/addFriend', {name}, {headers: {  'Authorization': `Bearer ${token}`}, withCredentials: true  })
		.then(response => {})
		.catch(error => {
			console.log(error);
		})
	}

// Si je remove friend, l'autre ne l'a plus en ami non plus
// Ajouter la fonction de check ami deja supprime
	const removeFriend = () => {
		console.log("TRYING TO REMOVE FRIEND");
		axios.post(process.env.REACT_APP_LOCAL_B + '/profile/removeFriend', {id}, {headers: {  'Authorization': `Bearer ${token}`}, withCredentials: true  })
		.then(response => {})
		.catch(error => {
			console.log(error);
		})
	}

	useEffect(() => {
		axios.get(process.env.REACT_APP_LOCAL_B + '/profile/getUserByName', {params: {username: username}})
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

	return (
		<div id="menu">
			<img id="bg-menu" src={Bar} alt={'Bar'}></img>

			<div className
			="box2">
				<div id="welcome2">
					<div id="profile_font">PROFIL</div>
						<div>	
							Nick : ({nick})<br/><br/> 
							Name : ({name})<br/><br/> 
							Age: ({age})<br/><br/>
						</div>
				</div>
				<div className ="pfp">
					<img src={pfp_url} alt="PPdeMORT"></img>
					<div className="buttons">
						<button className="btn-hover color-1" onClick={() => addFriend()}>Add Friend !!!!!!!!</button><br/>
						<button className="btn-hover color-2" onClick={() => removeFriend()}>Remove Friend :(</button><br/>
					</div>
				</div>
				<button id="move_on" onClick={() => navigate("/")}></button>
			</div>
		</div>
	)
}