import React from 'react'

import RandyBall from "../../../img/balls_randy.gif"

import './Loading.css';

export default function Loading() {

    return (
      <div id="loading-game">
        <img id="randy-balls" src={RandyBall} alt={'RandyBalls'}></img>
      </div>
    )
}
