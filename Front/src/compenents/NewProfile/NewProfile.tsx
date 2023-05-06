import React from 'react'

import './NewProfile.css'

import Skeeter from "../../img/skeeter.gif"
import BusStop from "../../img/backgrounds/skeeters-bar.jpg"

export default function NewProfile() {

	return (
		<div id="menu">
			<img id="bg-menu" src={BusStop} alt={'BusStop'}></img>
			<div className="box">
				<div id="welcome">WELCOME</div>
				<img id="skeeter" alt="skeeter" src={Skeeter}></img>
				<form>
					<input id="input-1" type="text" placeholder="Ton petit surnom 👶" required />
					<label htmlFor="input-1">
						<span className="nav-dot"></span>
						<div className="signup-button-trigger">Sign Up</div>
					</label>
					<input id="input-2" type="text" placeholder="john" required />
					<label htmlFor="input-2">
						<span className="label-text">Username</span>
						<span className="nav-dot"></span>
					</label>
					<p className="tip">Press Tab</p>
  					<div className="signup-button">Clique ici</div>
				</form>
			</div>
		</div>
	)
}
