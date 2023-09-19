import React from 'react'
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom";

import RedCross from "../../../img/buttons/red_cross.png"
import WhoFags from "../../../img/backgrounds/backgrounds-errors/fags.gif"

import './GameError.css';

export default function Loading() {

  const token = Cookies.get('accessToken');
  const navigate = useNavigate();

    const leavePage = () => {
	  	navigate(`/gamemenu`);
	  }

    if (!token)
        window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;
    return (
      <div id="error-game">
        <img id="red-cross" src={RedCross} alt="Red Cross" onClick={leavePage} />
        <div className="fags-text oups">OUPS</div>
        <img id="fags" src={WhoFags} alt="fags" />
        <div className="fags-text fags-quit">Quelqu'un a quitte la partie...</div>
      </div>
    )
}
