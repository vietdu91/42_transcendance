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
		const intervalId = setInterval(() => {
		  const clignoteDiv = document.getElementById('clignote');
		  if(!clignoteDiv) return
		  if (clignoteDiv.style.opacity === '1') {
			clignoteDiv.style.opacity = '0';
		  } else {
			clignoteDiv.style.opacity = '1';
		  }
		}, 500);
		const timer = setTimeout(() => {
		  setShowImage(false);
		}, 5000);
		return () => {
		  clearInterval(intervalId);
		  clearTimeout(timer);
		};
	  }, []);

	if (showImage) {
		return (
		  <div id="dislaimer">
			<div className="dislaimer_img">
				<img className="dislaimer_img" src={Dislaimer} alt="Fullscreen"/>
		  		<div id="clignote"></div>
			</div>
		  </div>
		);
	}
	
	return (
		<MenuConnexion />
	)
}
