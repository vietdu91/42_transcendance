import React from 'react'
import { useNavigate } from 'react-router-dom'

import './NewProfile.css'

import Skeeter from "../../img/skeeter.gif"
import Bar from "../../img/backgrounds/skeeters-bar.jpg"

import Import from "../../compenents/utils/ImportAvatar/ImportAvatar"
import Form from "../../compenents/utils/Form/Form"
import Range from "../../compenents/utils/Range/Range"

export default function NewProfile() {

	const navigate = useNavigate();

	return (
		<div id="menu">
			<img id="bg-menu" src={Bar} alt={'Bar'}></img>
			<div className="box">
				<div id="welcome">WELCOME</div>
				<img id="skeeter" alt="skeeter" src={Skeeter}></img>
				<Import/>
				<Form />
				<Range />
				<button id="move_on" onClick={() => navigate("/")}></button>
			</div>
		</div>
	)
}