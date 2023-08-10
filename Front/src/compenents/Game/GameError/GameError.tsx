import React from 'react'

import RandyBall from "../../../img/balls_randy.gif"
import WhoFags from "../../../img/backgrounds/backgrounds-errors/fags.gif"
import './GameError.css';

export default function Loading() {

    return (
      <div id="error-game">
        <div className="fags-text oups">OUPS</div>
        <img id="fags" src={WhoFags} alt="fags" />
        <div className="fags-text fags-quit">Quelqu'un a quitte la partie...</div>
        <img id="randy-balls" src={RandyBall} alt={'RandyBalls'}></img>
      </div>
    )
}
