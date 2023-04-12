import React from 'react'

import './Credits.css'

import Metrosexual from "../../img/metrosexual.png"

export default function Credits() {

	return (
		<div id="page_credits">
      		<img id="bg" src={Metrosexual} alt={'metrosexual'}></img>
			<div className="boutons">
				<a href="https://github.com/vietdu91" className="round-button1"></a>
				<a href="https://github.com/qujacob" className="round-button2"></a>
				<a href="https://github.com/Nixs0" className="round-button3"></a>
				<a href="https://github.com/QnYosa" className="round-button4"></a>
				<a href="https://github.com/Mbenda75" className="round-button5"></a>
			</div>
		</div>
	)
}
