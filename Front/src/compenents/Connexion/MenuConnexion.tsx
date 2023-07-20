import React, { useState } from 'react'

// CSS
import './Connexion.css';

// PACKAGES

// COMPENENTS
import WarningBox from "../utils/WarningBox/WarningBox";


// IMG
import Town from "../../img/backgrounds/south_park_town.jpg"
import Lotion from "../../img/backgrounds/lotion.jpg"


export default function MenuConnexion() {

    

    const [hover, setHover] = useState(Town);

    const handleLoginClick = () => {
        // Définition des cookies dans le stockage local
        //localStorage.setItem('cookieName', 'cookieValue');
        console.log('test');
        // Redirection vers une nouvelle URL
        window.location.href = "http://localhost:3001/Southtrans/42";
      };

    return (
        <div id="menu">
            {WarningBox() || null}
            <img id="bg-menu" src={hover} alt={'Hell'}></img>
            <div id="menu-items">
                  <div className="menu-item" onClick={handleLoginClick}
                onMouseEnter={() => {setHover(Lotion);}}
                  onMouseLeave={() => {setHover(Town);}}>Se connecter</div>
            </div>
        </div>
    )
}