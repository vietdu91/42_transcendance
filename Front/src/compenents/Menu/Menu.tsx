import React from 'react'

// CSS
import './Menu.css';

// PACKAGES
import { useNavigate } from "react-router-dom";

// COMPONENTS

// IMG
import Hell from "../../img/backgrounds/hell.jpg"
import Town from "../../img/backgrounds/south_park_town.jpg"
import NoFriend from "../../img/backgrounds/no_friend.jpg"
import Metrosexual from "../../img/backgrounds/metrosexual.png"
import KennyHouse from "../../img/backgrounds/kennyhouse.png"
import ButtersBlood from "../../img/backgrounds/butters_blood.jpg"
import ChefAid from "../../img/chef_aid.png"
import axios from 'axios';

export default function App() {
  const [hover, setHover] = React.useState(Town);
  const navigate = useNavigate();
  const [show, setShow] = React.useState(true);

  const handleClickCredits = (path, image) => {
    setHover(image);
    document.getElementById("bg-menu")?.classList.add("zoom-transition-bottom");
    setTimeout(() => {
      navigate(path);
      document.getElementById("bg-menu")?.classList.remove("zoom-transition-bottom");
    }, 500);
  };

  const handleClick = (path, image) => {
    setHover(image);
    document.getElementById("bg-menu")?.classList.add("zoom-transition");
    setTimeout(() => {
      navigate(path);
      document.getElementById("bg-menu")?.classList.remove("zoom-transition");
    }, 500);
  };

  function logout() {
    window.location.href = 'http://localhost:3001/Southtrans/logout';
  }

  function twoFa() {
    console.log("2FA");
    console.log(document.cookie);
    const cookies = document.cookie.split('; ');
    let accessToken;
    let id;
  
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'accessToken') {
        accessToken = value;
      }
      if (name === 'id') {  
        id = value;
      }
    }
    console.log("if id == " + id + " FIN");
    
    console.log("if access == " + accessToken + " FIN");
    if (accessToken) {
  
     axios.get('http://localhost:3001/Southtrans/2fa/generate', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).then(response => {
        // Do something with the response
        console.log("then acess == " + accessToken);
        console.log("then redirect");
        window.location.href = 'http://localhost:3001/Southtrans/2fa/generate';
      }).catch(error => {
        // Handle the error
        console.error('catch Access token not found in cookies.');
      });
    } else {
      console.error('Access token not found in cookies.');
    }
  }


  function twoff(){
    window.location.href = 'http://localhost:3001/Southtrans/2fa/generate';
  }

  function toggleThanks() {
    setShow(!show);
  }

  return (
    <div id="menu">
      <img id="bg-menu" src={hover} alt={'bg'}></img>
      <div id="menu-items">
        {show && <div className="menu-item" onClick={() => navigate("/game")} onMouseEnter={() => { setHover(ButtersBlood); }}
          onMouseLeave={() => { setHover(Town); }}>Jeu</div>}

        {show && <div className="menu-item" onClick={() => navigate("/")} onMouseEnter={() => { setHover(KennyHouse); }}
          onMouseLeave={() => { setHover(Town); }}>Profil</div>}

        {show && <div className="menu-item" onClick={() => navigate("/")} onMouseEnter={() => { setHover(NoFriend); }}
          onMouseLeave={() => { setHover(Town); }}>Chat</div>}

        {show && <div className="menu-item" onClick={() => { handleClickCredits("/credits", Metrosexual); toggleThanks(); }} onMouseEnter={() => { setHover(Metrosexual); }}
          onMouseLeave={() => { setHover(Town); }}>On est qui</div>}

        {show && <div className="menu-item" onClick={logout} onMouseEnter={() => { setHover(Hell); }}
          onMouseLeave={() => { setHover(Town); }}>Log Out</div>}

        {show && <div className="menu-item" onClick={twoFa} onMouseEnter={() => { setHover(ButtersBlood); }}
          onMouseLeave={() => { setHover(Town); }}>2FA</div>}


      </div>
      <div id="navbar">
        {show && <button className="thanks" onClick={() => { handleClick("/thanks", ChefAid); toggleThanks(); }}></button>}
        {show && <button className="msn"></button>}
        {show && <button className="butters" onClick={() => navigate("/quoi")}></button>}
      </div>
    </div>
  )
}
