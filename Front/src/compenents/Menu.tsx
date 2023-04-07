import React, { MouseEvent, useRef, useEffect } from 'react'

// CSS
import './Menu.css';

// PACKAGES
import { useNavigate } from "react-router-dom";
// import useSound from 'use-sound';

// COMPONENTS
import Music from "./Music";

// IMG
import Hell from "../img/hell.jpg"
import Town from "../img/south_park_town.jpg"

export default function App() {

  const navigate = useNavigate();

  function changeBackground(e) {
    // e.target.style.background = 'red';
    document.body.style.backgroundImage = 'url(../img/hell.jpg)'
  }

  function changeToNone(e) {
    // e.target.style.background = 'none';
  }

  return (
		<div id="menu">
      <Music />
  		<div id="menu-items">
        {/* <div className="menu-item" onMouseEnter={changeBackground} onMouseLeave={changeToNone} onClick={() => navigate("/")}>Jeu</div> */}
        <div className="menu-item" onClick={() => navigate("/")}>Jeu</div>
        <div className="menu-item" onClick={() => navigate("/")}>Profil</div>
        <div className="menu-item" onClick={() => navigate("/")}>Chat</div>
        <div className="menu-item" onClick={() => navigate("/")}>On est qui</div>
        <div className="menu-item" onClick={() => navigate("/score")}>Text Score</div>
      </div>
		</div>
  )
}
