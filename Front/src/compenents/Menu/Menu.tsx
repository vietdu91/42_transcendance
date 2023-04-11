import React, { useEffect } from 'react'

// CSS
import './Menu.css';

// PACKAGES
import { useNavigate } from "react-router-dom";

// COMPONENTS
import southparkSound from '../../sounds/theme_song.mp3';

// IMG
import Hell from "../../img/hell.jpg"
import Town from "../../img/south_park_town.jpg"
import NoFriend from "../../img/no_friend.jpg"
import Metrosexual from "../../img/metrosexual.png"
import KennyHouse from "../../img/kennyhouse.png"

export default function App() {
  const [hover, setHover] = React.useState(Town);
  const navigate = useNavigate();

  useEffect(() => {
    const audio = new Audio(southparkSound);
    audio.autoplay = true
  }, [])

  return (
		<div id="menu">
      <img id="bg-menu" src={hover} alt={'Hell'}></img>
  		<div id="menu-items">
        <div className="menu-item" onClick={() => navigate("/")} onMouseEnter={() => {setHover(Hell);}}
        onMouseLeave={() => {setHover(Town);}}>Jeu</div>
        <div className="menu-item" onClick={() => navigate("/")} onMouseEnter={() => {setHover(KennyHouse);}}
        onMouseLeave={() => {setHover(Town);}}>Profil</div>
        <div className="menu-item" onClick={() => navigate("/")} onMouseEnter={() => {setHover(NoFriend);}}
        onMouseLeave={() => {setHover(Town);}}>Chat</div>
        <div className="menu-item" onClick={() => navigate("/")} onMouseEnter={() => {setHover(Metrosexual);}}
        onMouseLeave={() => {setHover(Town);}}>On est qui</div>
      </div>
		</div>
  )
}
