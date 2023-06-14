import React, { useState, useEffect }  from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { httpClient } from '../utils/http-client'

import './Profile.css'

import Bar from "../../img/backgrounds/skeeters-bar.jpg"
import '../utils/ReturnButtom/ReturnButtom'
import ReturnButtom from '../utils/ReturnButtom/ReturnButtom'

function ProfileImage() {
	return (
		<div id="name">
			
		</div>
	)
}

let hello:string;
let data:any;
export default function Profile() {
	
	console.log(document.cookie);
    const cookies = document.cookie.split('; ');
    let accessToken;
    let id;
	const [post, setPost] = React.useState(null);

	for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'accessToken') {
        accessToken = value;
      }
      if (name === 'id') {  
        id = value;
      }
    }

	// if (accessToken) {
	// 	axios.get()
	// }
	return (
		<div id="menu">
			<img id="bg-menu" src={Bar} alt={'Bar'}></img>
			<div className="box">
				<h1 id="name">{hello}'s Profile</h1>
				<ProfileImage />
			</div>
			<div id="return">
				<ReturnButtom colorHexa='#000000' path='/'/>
			</div>
		</div>
	)
}
