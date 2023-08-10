import React, {useState} from 'react'
import './PageNotFound.css';

import StaticNoise from './StaticNoise';

import NoInternet from "../../img/backgrounds/backgrounds-errors/404_no_internet.jpg"

export default function PageNotFound() {

	const [isTurnedOn, setIsTurnedOn] = useState(false);

	const handleToggleSwitcherTV = () => {
	  setIsTurnedOn(prevState => !prevState);
	};
  
	return (
	  <div className="page404">
			<StaticNoise />
		<section className={`screen ${isTurnedOn ? 'turned-on' : ''}`}>
		  <div className="content">
			<img src={NoInternet} alt="#"></img>
		  </div>
		</section>
		<button id="switcher-tv" onClick={handleToggleSwitcherTV}>
		  Turn On/Off
		</button>
	  </div>
	);
};
