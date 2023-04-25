import React from 'react'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'

import './Credits.css'

import Metrosexual from "../../img/video/kyle_gets_a_queer_eye_makeover.mp4"

function Cercle() {

	let benmoham="https://github.com/Mbenda75";
	let dyoula="https://github.com/QnYosa";
	let emtran="https://github.com/vietdu91";
	let jkaruk="https://github.com/Nixs0";
	let qujacob="https://github.com/qujacob";

	return (
		<div id="boutons">
				<div className="Container">
					<div id="creator">
						<div className="round round-button1"></div>
						<a href={emtran} target="_blank" rel="noopener noreferrer">emtran</a>
					</div>
					<div id="creator">
						<div className="round round-button2"></div>
						<a href={qujacob} target="_blank" rel="noopener noreferrer">qujacob</a>
					</div>
					<div id="creator">
						<div className="round round-button3"></div>
						<a href={jkaruk} target="_blank" rel="noopener noreferrer">jkaruk</a>
					</div>
					<div id="creator">
						<div className="round round-button4"></div>
						<a href={dyoula} target="_blank" rel="noopener noreferrer">dyoula</a>
					</div>
					<div id="creator">
						<div className="round round-button5"></div>
						<a href={benmoham} target="_blank" rel="noopener noreferrer">benmoham</a>
					</div>
				</div>
			</div>
	)
}

export default function Credits() {

	const navigate = useNavigate();

	return (
		<div>
			<div id="page_credits">
				<video autoPlay muted loop id="bg" src={Metrosexual}></video>
				<Cercle />
			</div>
			<div id="return">
				<FontAwesomeIcon icon={faChevronCircleLeft}
				style={{color: "#ff30ff"}} onClick={() => navigate("/")}/>
			</div>
		</div>
	)
}
