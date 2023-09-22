import React, {useState, useEffect} from 'react';
import './FooterMenu.css'
import xpLogo from '../../../img/chat/xp-logo-removebg-preview.png';
import { useNavigate } from "react-router-dom";

import Explorer from '../../../img/chat/explorer.png'
import Dossier from '../../../img/chat/dossier.png'
import MSN from '../../../img/chat/group-conv.png'

const FooterMenu = () => {

    const navigate = useNavigate();

    function Clock() {
        const [currentHour, setCurrentHour] = useState(new Date().getHours());
        const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes());
      
        useEffect(() => {
          const intervalId = setInterval(() => {
            const now = new Date();
            setCurrentHour(now.getHours());
            setCurrentMinute(now.getMinutes());
          }, 1000);
      
          return () => clearInterval(intervalId);
        }, []);
      
        return (
            <li className="footer-time">{currentHour < 10 ? `0${currentHour}` : currentHour}:{currentMinute < 10 ? `0${currentMinute}` : currentMinute}</li>
        );
      }

    return (
        <ul className="menu-footer">
            <li className="footer-first-element" onClick={() => navigate('/')}>
                <img src={xpLogo} alt="redcross" id="window"/>
                <span>Démarrer</span></li>
            <li className="footer-element-1">
                <img alt="#" src={MSN} className="footer-icon"></img>
                Transcendance Messenger</li>
            <li className="footer-element">
                <img alt="#" src={Explorer} className="footer-icon"></img>
                Internet Explorer</li>
            <li className="footer-element">
                <img alt="#" src={Dossier} className="footer-icon"></img>
                ft_transcendance</li>
            <Clock />
        </ul>
    );
};

export default FooterMenu;

// pour afficher les conditions il faudra modifier l'export
// et envoyer les ddeux. 

// const ConversationInFooter = ({ Messages }) => {
//     if (Messages) {
//         return (
//             <ul className="menu-footer">
//                 <li className="footer-element">hola</li>
//             </ul>
//         );
//     } else {
//         return null;
//     }
// };

// export { FooterMenu, ConversationInFooter};


// Export a caler dans le fichier principal
// import { FooterMenu, ConversationInFooter } from './FooterMenu';
