import React, { useState, useEffect } from 'react'

// CSS
import './Connexion.css';

// PACKAGES

// COMPENENTS
import MenuConnexion from './MenuConnexion';

// IMG
import Dislaimer from "../../img/dislaimer.png"


export default function Connexion() {

	const [showImage, setShowImage] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
		  setShowImage(false);
		}, 100000);
		return () => clearTimeout(timer);
	}, []);

	if (showImage) {
		return (
		  <div id="dislaimer">
			<img className="dislaimer_img" src={Dislaimer} alt="Fullscreen"/>
		  	<div id="clignote"></div>
		  </div>
		);
	}

	return (
		<MenuConnexion />
	)
}
