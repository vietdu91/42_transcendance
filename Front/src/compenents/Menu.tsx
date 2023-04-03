import React from 'react'

// CSS
import './Menu.css';

// PACKAGES
import { useNavigate } from "react-router-dom";

// COMPONENTS
// import Score from "./Score"

export default function App() {

  const navigate = useNavigate();

  return (

		<div id="menu">
			<div id="menu-items">
        {/* <Link className="menu-item" to="/">Jeu</Link>
        <Link className="menu-item" to="/">Profil</Link>
        <Link className="menu-item" to="/">Chat</Link>
        <Link className="menu-item" to="/">On est qui</Link> */}
        {/* <Link className="menu-item" to="/score">Test Score</Link> */}
        <div className="menu-item" onClick={() => navigate("/score")}>Text Score</div>
      </div>
			<div id="menu-background-pattern"></div>
		</div>
  )
}
