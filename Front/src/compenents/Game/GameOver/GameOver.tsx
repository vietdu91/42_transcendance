import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function GameOver() {

	const [showButtonCartman, setShowButtonCartman] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const navigate = useNavigate();

	const leavePage = () => {
		navigate(`/gamemenu`);
	}

	useEffect(() => {
		const showButtonCartmanDelay = 4000;
		setTimeout(() => {
		  setShowButtonCartman(true);
		}, showButtonCartmanDelay);
	  }, []);

	  useEffect(() => {
		const showButtonCartmanDelay = 4000;
		setTimeout(() => {
		  setShowButtonCartman(true);
		}, showButtonCartmanDelay);
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
	    <div className="span-container">
	      <span className="span">GAME</span>
	      <span className="span over">OVER</span>
	    </div>
	    <img id="img_gameover" alt="gameOver" src={ServietskySad} />
	  </div>
	);
}
