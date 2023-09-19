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
import Cookies from 'js-cookie';

export default function App() {
  const accessToken = Cookies.get('accessToken');

  if (!accessToken) {
    window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;
  }
  const [hover, setHover] = React.useState(Town);
  const navigate = useNavigate();
  const [show, setShow] = React.useState(true);
  const [show2, setShow2] = React.useState(false);
  const [code, setCode] = React.useState("");

  // console.log(process.env.REACT_APP_LOCAL_B);
  const apiEndpoint = process.env.REACT_APP_LOCAL_B;
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

  async function logout() {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      try {
        console.log("AXIOS LOGOUT ON")
        const res = await axios({
          url: process.env.REACT_APP_LOCAL_B + "/Auth/logout",
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}` },
        })
        Cookies.remove('accessToken');
        Cookies.remove('id');
        console.log("COOKIES REMOVED")
        navigate("/connect");
        console.log("NAVIGATED")
      }
      catch (err) {
        console.log("app-front: error: ", err)
      }
    } else {
      console.error('Access token not found in cookies.');
    }
  }

  function toggleThanks() {
    setShow(!show);
  }

  return (
    <div id="menu">
      <img id="bg-menu" src={hover} alt={'bg'}></img>
      <div id="menu-items">
        {show && <div className="menu-item" onClick={() => navigate("/gamemenu")} onMouseEnter={() => { setHover(ButtersBlood); }}
          onMouseLeave={() => { setHover(Town); }}>Jeu</div>}

        {show && <div className="menu-item" onClick={() => navigate("/profile")} onMouseEnter={() => { setHover(KennyHouse); }}
          onMouseLeave={() => { setHover(Town); }}>Profil</div>}

        {show && <div className="menu-item" onClick={() => { handleClickCredits("/credits", Metrosexual); toggleThanks(); }} onMouseEnter={() => { setHover(Metrosexual); }}
          onMouseLeave={() => { setHover(Town); }}>On est qui</div>}

        {show && <div className="menu-item" onClick={logout} onMouseEnter={() => { setHover(Hell); }}
          onMouseLeave={() => { setHover(Town); }}>Log Out</div>}

      </div>
      <div id="navbar">
        {show && <button className="thanks" onClick={() => { handleClick("/thanks", ChefAid); toggleThanks(); }}></button>}
        {show && <button className="msn" onClick={() => navigate("/chat")} onMouseEnter={() => { setHover(NoFriend); }} onMouseLeave={() => { setHover(Town); }}></button>}
        {show && <button className="butters" onClick={() => navigate("/quoi")}></button>}
      </div>
    </div>
  )
}
