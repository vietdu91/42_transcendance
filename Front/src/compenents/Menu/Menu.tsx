import React from 'react'

// CSS
import './Menu.css';

// PACKAGES
import { useNavigate } from "react-router-dom";

// COMPONENTS

// IMG
import Hell from "../../img/hell.jpg"
import Town from "../../img/south_park_town.jpg"
import NoFriend from "../../img/no_friend.jpg"
import Metrosexual from "../../img/metrosexual.png"
import KennyHouse from "../../img/kennyhouse.png"
import ButtersBlood from "../../img/butters_blood.jpg"

export default function App() {
  const [hover, setHover] = React.useState(Town);
  const navigate = useNavigate();

  return (
		<div id="menu">
      <img id="bg-menu" src={hover} alt={'bg'}></img>
  		<div id="menu-items">
        <div className="menu-item" onClick={() => navigate("/")} onMouseEnter={() => {setHover(ButtersBlood);}}
        onMouseLeave={() => {setHover(Town);}}>Jeu</div>
        <div className="menu-item" onClick={() => navigate("/")} onMouseEnter={() => {setHover(KennyHouse);}}
        onMouseLeave={() => {setHover(Town);}}>Profil</div>
        <div className="menu-item" onClick={() => navigate("/")} onMouseEnter={() => {setHover(NoFriend);}}
        onMouseLeave={() => {setHover(Town);}}>Chat</div>
        <div className="menu-item" onClick={() => navigate("/credits")} onMouseEnter={() => {setHover(Metrosexual);}}
        onMouseLeave={() => {setHover(Town);}}>On est qui</div>
        <div className="menu-item" onClick={() => navigate("/connect")} onMouseEnter={() => {setHover(Hell);}}
        onMouseLeave={() => {setHover(Town);}}>Log Out</div>
      </div>
      <div id="navbar">
        <button className="thanks" onClick={() => navigate("/thanks")}></button>
        <button className="msn"></button>
        <button className="butters" onClick={() => navigate("/quoi")}></button>
      </div>
		</div>
  )
}
