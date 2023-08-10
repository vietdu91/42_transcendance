import React from 'react'
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import './Credits.css'

import Metrosexual from "../../img/video/kyle_gets_a_queer_eye_makeover.mp4"

import ReturnButtom from '../utils/ReturnButtom/ReturnButtom'

function Cercle() {

	const Creator = ({pathGitHub, classes, frerot}) => {

		return (
			<div id="creator">
				<div className={classes}></div>
				<a href={pathGitHub} target="_blank" rel="noopener noreferrer">{frerot}</a>
			</div>
		);
	};

	Creator.propTypes = {
		pathGitHub: PropTypes.string.isRequired,
		classes: PropTypes.string.isRequired,
		frerot: PropTypes.string.isRequired,
	};

	let benmoham="https://github.com/Mbenda75";
	let dyoula="https://github.com/QnYosa";
	let emtran="https://github.com/vietdu91";
	let jkaruk="https://github.com/Nixs0";
	let qujacob="https://github.com/qujacob";

	return (
		<div id="boutons">
				<div className="Container">
					<Creator pathGitHub={benmoham} classes='round round-button5' frerot='benmoham'/>
					<Creator pathGitHub={dyoula} classes='round round-button4' frerot='dyoula'/>
					<Creator pathGitHub={emtran} classes='round round-button1' frerot='emtran'/>
					<Creator pathGitHub={jkaruk} classes='round round-button3' frerot='jkaruk'/>
					<Creator pathGitHub={qujacob} classes='round round-button2' frerot='qujacob'/>
				</div>
			</div>
	)
}

export default function Credits() {

	const token = Cookies.get('accessToken');
    if (!token)
        window.location.href = "http://localhost:3000/connect";

	return (
		<>
			<div id="page_credits">
				<video autoPlay muted loop id="bg" src={Metrosexual}></video>
				<Cercle />
			</div>
			<div id="return">
				<ReturnButtom colorHexa='#ff30ff' path='/' />
			</div>
		</>
	)
}
