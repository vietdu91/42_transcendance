import React from 'react'

import './Credits.css'

import Metrosexual from "../../img/metrosexual.png"

export default function Credits() {

	return (
		<div id="page_credits">
      		<img id="bg" src={Metrosexual} alt={'metrosexual'}></img>
			<div id="boutons">
				<button className="round-button1"></button>
				<button className="round-button2"></button>
				<button className="round-button3"></button>
				<button className="round-button4"></button>
				<button className="round-button5"></button>
			</div>
		</div>
	)
}
