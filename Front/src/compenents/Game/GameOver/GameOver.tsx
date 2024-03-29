import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from "js-cookie";

import './GameOver.css';

import CartmanSad from '../../../img/gameover/cartman_sad.gif';
import ServietskySad from '../../../img/gameover/servietsky_sad.gif';
import KennySad from '../../../img/gameover/kenny_sad.gif';
import TimmySad from '../../../img/gameover/timmy_sad.gif';
import TerrancePhilipSad from '../../../img/gameover/terrance_philip_sad.gif';
import GarrisonSad from '../../../img/gameover/garrisson_sad.jpg';
import HenriettaSad from '../../../img/gameover/henrietta_sad.gif'
import ButtersSad from '../../../img/gameover/butters_sad.gif';

import ButtonCartmanSad1 from "../../../img/gameover/button_cartman_sad_1.gif";
import ButtonCartmanSad2 from "../../../img/gameover/button_cartman_sad_2.gif";

import GarrisonAgain from "../../../img/gameover/garrison_again_1.gif"
import GarrisonAgain2 from "../../../img/gameover/garrison_again_2.gif"

import CulbuterTaMere from '../../../sounds/win_and_GO/La Mort.mp3'

export default function GameOver() {
	const token = Cookies.get('accessToken');
    if (!token)
        window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;

	const [showButtonCartman, setShowButtonCartman] = useState(false);
	const [showGarrison, setShowGarrison] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	if (location.state == null) {
		window.location.href = "/";
	}
	const { char } = location.state;
	

	const whoCharacter = (char:string): string => {
		switch (char) {
			case "Cartman" : return (CartmanSad);
			case "Servietsky" : return (ServietskySad);
			case "Kenny" : return (KennySad);
			case "Timmy" : return (TimmySad);
			case "TerrancePhilip" : return (TerrancePhilipSad);
			case "Garrison" : return (GarrisonSad);
			case "Henrietta" : return (HenriettaSad);
			case "Butters" : return (ButtersSad);
		}
		return "";
	}

	const leavePage = () => {
		navigate(`/`);
	}

	const tryagain = () => {
		navigate(`/gamemenu`);
	}

	useEffect(() => {
		const showButtonCartmanDelay = 4000;
		setTimeout(() => {
		  setShowButtonCartman(true);
		}, showButtonCartmanDelay);
	  }, []);

	  useEffect(() => {
		const showGarrisonDelay = 4000;
		setTimeout(() => {
		  setShowGarrison(true);
		}, showGarrisonDelay);
	  }, []);

	  const handleMouseEnter = () => {
		setIsHovering(true);
	  };

	  const handleMouseLeave = () => {
		setIsHovering(false);
	  };


	useEffect(() => {
	  const showImageDelay = 3000;
	  setTimeout(() => {
	    const bgGameOver = document.getElementById('bg-gameover');
	    bgGameOver?.classList.add('show-image');
	  }, showImageDelay);
	}, []);

	return (
	  <div id="bg-gameover">
		<iframe src={CulbuterTaMere} title="culbutertamere_sound" allow="autoplay" id="iframeAudio"></iframe>
      {showButtonCartman && (
        <img
          id="button-cartman-sad"
          alt="#"
          src={isHovering ? ButtonCartmanSad2 : ButtonCartmanSad1}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
		  onClick={leavePage}
        />
      )}
			{showGarrison && (
				<img
					id="garrison_again"
					alt="#"
					src={isHovering ? GarrisonAgain2 : GarrisonAgain}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onClick={tryagain}
				/>
			)}
	    <div className="span-container">
	      <span className="span">GAME</span>
	      <span className="span over">OVER</span>
	    </div>
	    <img id="img_gameover" alt="gameOver" src={whoCharacter(char)} />
	  </div>
	);
}
