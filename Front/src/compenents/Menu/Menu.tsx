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
  const [show2, setShow2] = React.useState(false);
  const [code, setCode] = React.useState("");
  
  
  const  apiEndpoint = 'http://localhost:3001';
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

    console.log('access token = ' + accessToken);
    if (accessToken) {
      try {
          const res = await axios({
            url: apiEndpoint + '/Southtrans/logout',
            method: 'POST',
            headers: {  'Authorization': `Bearer ${accessToken}` },
            data: { msg: "Hello World!" }
          })
          console.log("IM HERE BRO")
          navigate("/connect")
          console.log("NAVIGATED")
        }
      catch (err) {
        console.log("app-front: error: ", err)
        navigate("/connect")
      }
     } else {
       console.error('Access token not found in cookies.');
     }
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
        console.log("then redirect");
        console.log(response);
        setCode(response.data.code)
        setShow2(true);
      }).catch(error => {
        // Handle the error
        console.error('catch Access token not found in cookies.');
      });
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

        {show && <div className="menu-item" onClick={() => navigate("/chat")} onMouseEnter={() => { setHover(NoFriend); }}
          onMouseLeave={() => { setHover(Town); }}>Chat</div>}

        {show && <div className="menu-item" onClick={() => { handleClickCredits("/credits", Metrosexual); toggleThanks(); }} onMouseEnter={() => { setHover(Metrosexual); }}
          onMouseLeave={() => { setHover(Town); }}>On est qui</div>}

        {show && <div className="menu-item" onClick={logout} onMouseEnter={() => { setHover(Hell); }}
          onMouseLeave={() => { setHover(Town); }}>Log Out</div>}

        {show && <div className="menu-item" onClick={twoFa} onMouseEnter={() => { setHover(ButtersBlood); }}
          onMouseLeave={() => { setHover(Town); }}>2FA</div>}

        

        {show2 && 
        <>
        <img src={code}></img>
        <input placeholder='code'></input>
        </>
        } 
      </div>
      <div id="navbar">
        {show && <button className="thanks" onClick={() => { handleClick("/thanks", ChefAid); toggleThanks(); }}></button>}
        {show && <button className="msn" onClick={() => navigate("/chat")}></button>}
        {show && <button className="butters" onClick={() => navigate("/quoi")}></button>}
      </div>
    </div>
  )
}
