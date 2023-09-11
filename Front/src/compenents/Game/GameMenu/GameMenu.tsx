import React, { useRef, useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
// import { GameContext } from '../../utils/GameContext';
import Cookies from 'js-cookie';
import axios from 'axios';

import MentalBattle from "../../../img/backgrounds/mental_battle.jpg"
import RedCross from "../../../img/buttons/red_cross.png"
import MustWatchIt from "../../../img/must_watch_it.gif"
import Loading from "../../utils/Loading/Loading"

import Couronne from "../../../img/game/couronne.png"

/* YEUX - HISTORY */
import EyesCartmanWin from "../../../img/eyes/cartmanWin.jpg"
import EyesCartmanLost from "../../../img/eyes/cartmanLost.jpg"
import EyesKennyWin from "../../../img/eyes/kennyWin.jpg"
import EyesKennyLost from "../../../img/eyes/kennyLost.jpg"
import EyesTimmyWin from "../../../img/eyes/timmyWin.jpg"
import EyesTimmyLost from "../../../img/eyes/timmyLost.jpg"
import EyesGarrisonWin from "../../../img/eyes/garrisonWin.jpg"
import EyesGarrisonLost from "../../../img/eyes/garrisonLost.jpg"
import EyesButtersWin from "../../../img/eyes/buttersWin.jpg"
import EyesButtersLost from "../../../img/eyes/buttersLost.jpg"
import EyesTPLost from "../../../img/eyes/TPLost.jpg"
import EyesTPWin from "../../../img/eyes/TPWin.jpg"
import EyesHenriettaWin from "../../../img/eyes/henriettaWin.jpg"
import EyesHenriettaLost from "../../../img/eyes/henriettaLost.jpg"
import EyesServietskyWin from "../../../img/eyes/servietskyWin.jpg"
import EyesServietskyLost from "../../../img/eyes/servietskyLost.jpg"

/* SPECTATE */
import CartmanL from "../../../img/en_cours/cartman_left.png"
import CartmanR from "../../../img/en_cours/cartman_right.png"
import GarrisonL from "../../../img/en_cours/garrison_left.png"
import GarrisonR from "../../../img/en_cours/garrison_right.png"
import KennyL from "../../../img/en_cours/kenny_left.png"
import KennyR from "../../../img/en_cours/kenny_right.png"
import TimmyL from "../../../img/en_cours/timmy_left.png"
import TimmyR from "../../../img/en_cours/timmy_right.png"
import TP_L from "../../../img/en_cours/TP_left.png"
import TP_R from "../../../img/en_cours/TP_right.png"
import ButtersL from "../../../img/en_cours/butters_left.png"
import ButtersR from "../../../img/en_cours/butters_right.png"
import HenriettaL from "../../../img/en_cours/henrietta_left.png"
import HenriettaR from "../../../img/en_cours/henrietta_right.png"
import ServietskyL from "../../../img/en_cours/servietsky_left.png"
import ServietskyR from "../../../img/en_cours/servietsky_right.png"

import VS from "../../../img/en_cours/VS.png"

import StaticNoise from '../../../img/static_noise.gif';

import './GameMenu.css';

interface User {
	name: string,
	winrate: number,
}

function SpecMenu() {
	
	const [isBlinking, setIsBlinking] = useState(false);
	const click = useRef(false);
	const [id, setId] = useState(-1);
	// const socket = useContext(GameContext);

    const [hoveredPartie, setHoveredPartie] = useState(StaticNoise);
	const navigate = useNavigate();
	
	const goToPartiesEnCours = () => {
        navigate(`/partiesencours`)
    };

	useEffect(() => {

		const interval = setInterval(() => {
			setIsBlinking((prevIsBlinking) => !prevIsBlinking);
		  }, 500); 
		return () => clearInterval(interval);	}, []);

	    function GetPartie({img_left, img_right}) {

			return (
				<div className="spectate-tv" onMouseEnter={() => setHoveredPartie(null)} onMouseLeave={() => setHoveredPartie(StaticNoise)}>
				{hoveredPartie === null ? (
					<>
						<div id="container-spectate-partieLeft">
							<img alt="#" src={img_left} className="spectate-playerLeft-img"></img>
							<div className="spectate-playerLeft">emtran</div>
						</div>
						<div id="container-spectate-partieRight">
							<img alt="#" src={img_right} className="spectate-playerRight-img"></img>
							<div className="spectate-playerRight">dyoula</div>
						</div>
						<img alt="#" src={VS} className="spectate-versus-encours"></img>
					</>
				) : (
					<img src={StaticNoise} alt="static_noise" className="spectate-tv" />
				)}
			</div>
			);
		}

	return (
		<div id="spec-menu">
			<div id="spectate-bg">
				<div id="spectate-font">
					PARTIE(S) <br/> EN COURS
				</div>
				<div className={`cercle ${isBlinking ? 'visible' : 'hidden'}`}></div>
				<div id="live">
					LIVE
				</div>
				<div className="spectate-history" >
					<GetPartie img_left={GarrisonL} img_right={GarrisonR} />
                    <GetPartie img_left={KennyL} img_right={KennyR} />
				</div>
				<img src={MustWatchIt} alt="#" id="mustWatchIt" onClick={goToPartiesEnCours}></img>
			</div>
		</div>
	)
}

function History() {

	const [hoverMatchMenu, setHoverMatchMenu] = useState(false);
	const [hoverMatch1Square, setHoverMatch1Square] = useState(false);
	const [hoverMatch2Square, setHoverMatch2Square] = useState(false);
	const [hoverMatch3Square, setHoverMatch3Square] = useState(false);

	const changeMatchMenuEnter = () => {
		setHoverMatchMenu(true);
		const opacitySquare1 = document.getElementById('match-square-1');
		if (!opacitySquare1) return
		opacitySquare1.style.opacity = '0.75';
		const opacitySquare2 = document.getElementById('match-square-2');
		if (!opacitySquare2) return
		opacitySquare2.style.opacity = '0.75';
		const opacitySquare3 = document.getElementById('match-square-3');
		if (!opacitySquare3) return
		opacitySquare3.style.opacity = '0.75';
	}

	const changeMatchMenuLeave = () => {
		setHoverMatchMenu(false);
		console.log("prout");
		const opacitySquare1 = document.getElementById('match-square-1');
		if (!opacitySquare1) return
		opacitySquare1.style.opacity = '0.2';
		const opacitySquare2 = document.getElementById('match-square-2');
		if (!opacitySquare2) return
		opacitySquare2.style.opacity = '0.2';
		console.log(opacitySquare2.style.opacity);
		const opacitySquare3 = document.getElementById('match-square-3');
		if (!opacitySquare3) return
		opacitySquare3.style.opacity = '0.2';
	}

	const changeMatchSquare1Enter = () => {
		setHoverMatch1Square(true);
		const opacitySquare = document.getElementById('match-square-1');
		if (!opacitySquare) return
		opacitySquare.style.opacity = '1';
	}

	const changeMatchSquare1Leave = () => {
		setHoverMatch1Square(false);
		const opacitySquare = document.getElementById('match-square-1');
		if (!opacitySquare) return
		opacitySquare.style.opacity = '0.75';
	}

	const changeMatchSquare2Enter = () => {
		setHoverMatch2Square(true);
		const opacitySquare = document.getElementById('match-square-2');
		if (!opacitySquare) return
		opacitySquare.style.opacity = '1';
	}

	const changeMatchSquare2Leave = () => {
		setHoverMatch2Square(false);
		const opacitySquare = document.getElementById('match-square-2');
		if (!opacitySquare) return
		opacitySquare.style.opacity = '0.75';
	}

	const changeMatchSquare3Enter = () => {
		setHoverMatch3Square(true);
		const opacitySquare = document.getElementById('match-square-3');
		if (!opacitySquare) return
		opacitySquare.style.opacity = '1';
	}

	const changeMatchSquare3Leave = () => {
		setHoverMatch3Square(false);
		const opacitySquare = document.getElementById('match-square-3');
		if (!opacitySquare) return
		opacitySquare.style.opacity = '0.75';
	}

	return (
		<div id="history-menu" onMouseEnter={() => { changeMatchMenuEnter(); }}
		onMouseLeave={() => { changeMatchMenuLeave(); }}>
			<div id="history-bg">
				<div id="history-font">
					DERNIERES PARTIES JOUEES
				</div>
				<div className="match-history" >
                    <div id="match-square-1" onMouseEnter={() => { changeMatchSquare1Enter(); }}
          			onMouseLeave={() => { changeMatchSquare1Leave(); }}>
						<div id="container-eyesUp">
							<img alt="#" src={EyesCartmanWin} className="eyesUp-1"></img>
							{hoverMatch1Square && <div className="scoreUp">5</div>}
							{hoverMatch1Square && <div className="playerUp">emtran</div>}
						</div>
						<div id="container-eyesDown">
							<img alt="#" src={EyesCartmanLost} className="eyesDown-1"></img>
							{hoverMatch1Square && <div className="playerDown">dyoula</div>}
							{hoverMatch1Square && <div className="scoreDown">1</div>}
						</div>
					</div>
                    <div id="match-square-2" onMouseEnter={() => { changeMatchSquare2Enter(); }}
          			onMouseLeave={() => { changeMatchSquare2Leave(); }}>
						<div id="container-eyesUp">
							<img alt="#" src={EyesTimmyWin} className="eyesUp-2"></img>
							{hoverMatch2Square && <div className="scoreUp">5</div>}
							{hoverMatch2Square && <div className="playerUp">emtran</div>}
						</div>
						<div id="container-eyesDown">
							<img alt="#" src={EyesTimmyLost} className="eyesDown-2"></img>
							{hoverMatch2Square && <div className="playerDown">qujacob</div>}
							{hoverMatch2Square && <div className="scoreDown">4</div>}
						</div>
					</div>
                    <div id="match-square-3" onMouseEnter={() => { changeMatchSquare3Enter(); }}
          			onMouseLeave={() => { changeMatchSquare3Leave(); }}>
						<div id="container-eyesUp">
							<img alt="#" src={EyesHenriettaWin} className="eyesUp-3"></img>
							{hoverMatch3Square && <div className="scoreUp">5</div>}
							{hoverMatch3Square && <div className="playerUp">encule</div>}
						</div>
						<div id="container-eyesDown">
							<img alt="#" src={EyesHenriettaLost} className="eyesDown-3"></img>
							{hoverMatch3Square && <div className="playerDown">emtran</div>}
							{hoverMatch3Square && <div className="scoreDown">2</div>}
						</div>
					</div>
                </div>
			</div>
		</div>
	)
}

function Classement() {

	// function CouronneOrNot() {

	// 	return (
	// 		<img src={Couronne} alt="couronne" id="classement-couronne"></img>
	// 	)
	// }
	
	function GetPlace({position, name, points}) {
		
		return (
			<tr>
				<td className="number">{position}</td>
				<td className="classement-photo-profil">
					<img className="classement-photo" src={EyesCartmanWin} alt="#"></img>
				</td>
				<td className="name">{name}</td>
				<td className="points">{points}</td>
			</tr>
		)
		
	}
	
	return (
		<div id="classement-menu">
			<div id="classement-bg">
				<div id="classement-font">
					CLASSEMENT
				</div>
				<div className="div-classement-table">
					<table className="classement-table">
						<GetPlace position="1" name="emtran (le KING)" points="100%"></GetPlace>
						<GetPlace position="2" name="benmoham" points="95.4%"></GetPlace>
						<GetPlace position="3" name="jkaruk" points="94%"></GetPlace>
						<GetPlace position="4" name="dyoula" points="85%"></GetPlace>
						<GetPlace position="5" name="qujabob" points="13%"></GetPlace>
						<GetPlace position="6" name="qujabob" points="13%"></GetPlace>
						<GetPlace position="7" name="qujabob" points="13%"></GetPlace>
						<GetPlace position="8" name="qujabob" points="13%"></GetPlace>
						<GetPlace position="9" name="qujabob" points="13%"></GetPlace>
						<GetPlace position="10" name="qujabob" points="13%"></GetPlace>
						<GetPlace position="11" name="qujabob" points="13%"></GetPlace>
					</table>
				</div>
			</div>
		</div>
	)
}

function PlayButton() {

	const navigate = useNavigate();

	const handleClick = () => {
		navigate("/champselect");
	}

	return (
		<a className="play-button" href="#" onClick={handleClick}>
			<span>GO FIGHT</span>
			<span id="span_menu">
				<svg width="66px" height="43px" viewBox="0 0 66 43" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
					<g id="arrow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
					<path className="one" d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z" fill="#FFFFFF"></path>
					<path className="two" d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z" fill="#FFFFFF"></path>
					<path className="three" d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z" fill="#FFFFFF"></path>
					</g>
				</svg>
			</span>
		</a>
	)
}

export default function GameMenu() {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	
	const token = Cookies.get('accessToken');
    if (!token)
        window.location.href = "http://localhost:3000/connect";

	useEffect(() => {
	  const timer = setTimeout(() => {
		setIsLoading(false);
	  }, 1500);
  
	  return () => clearTimeout(timer);
	}, []);
  
	const leavePage = () => {
	  navigate(`/`);
	};
  
	return (
	  <>
		{isLoading ? (
			<Loading />
		) : (
		  <div className="bg-game">
			<img className="bg-game bg-mental" src={MentalBattle} alt={'ButtersBlood'}></img>
			<img id="red-cross" src={RedCross} onClick={leavePage}></img>
			<SpecMenu />
			<PlayButton />
			<History />
			<Classement />
		  </div>
		)}
	  </>
	);
  }