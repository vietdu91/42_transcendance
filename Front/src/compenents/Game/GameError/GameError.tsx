import React from 'react'
import Cookies from "js-cookie"

import RandyBall from "../../../img/balls_randy.gif"
import WhoFags from "../../../img/backgrounds/backgrounds-errors/fags.gif"
import './GameError.css';

export default function Loading() {
    const token = Cookies.get('accessToken');
    if (!token)
        window.location.href = "http://localhost:3000/connect";
    return (
      <div id="error-game">
        <div className="fags-text oups">OUPS</div>
        <img id="fags" src={WhoFags} alt="fags" />
        <div className="fags-text fags-quit">Quelqu'un a quitte la partie...</div>
        <img id="randy-balls" src={RandyBall} alt={'RandyBalls'}></img>
      </div>
    )
}
