import React from 'react'

import './Credits.css'

import Metrosexual from "../../img/video/kyle_gets_a_queer_eye_makeover.mp4"

function Cercle() {

	return (
			<div id="boutons">
				<div className="Container">
					<div id="creator">
						<div className="round round-button1">
							<div className="inner"></div>
						</div>
						<p>emtran</p>
					</div>
					<div id="creator">
						<div className="round round-button2"></div>
						<p>qujacob</p>
					</div>
					<div id="creator">
						<div className="round round-button3"></div>
						<p>jkaruk</p>
					</div>
					<div id="creator">
						<div className="round round-button4"></div>
						<p>dyoula</p>
					</div>
					<div id="creator">
						<div className="round round-button5"></div>
						<p>benmoham</p>
					</div>
				</div>
			</div>
	)
}

export default function Credits() {

	return (
		<div id="page_credits">
      		<video autoPlay muted loop id="bg" src={Metrosexual}></video>
			<Cercle />
		</div>
	)
}
