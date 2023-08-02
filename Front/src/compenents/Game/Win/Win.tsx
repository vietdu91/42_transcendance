import React, {useEffect} from 'react';

import './Win.css';

import CartmanWin from "../../../img/win/cartman_win.gif"
import KennyWin from "../../../img/win/kenny_win.gif"
import TimmyWin from "../../../img/win/timmy_win.gif"
import TPWin from "../../../img/win/tp_win.gif"
import ButtersWin from "../../../img/win/butters_win.gif"
import ServietskyWin from "../../../img/win/servietsky_win.gif"
import HenriettaWin from "../../../img/win/henrietta_win.gif"
import GarrisonWin from "../../../img/win/garrison_win.gif"

export default function Win() {

  useEffect(() => {
	  const showImageDelay = 3000;
	  setTimeout(() => {
	    const bgWin = document.getElementById('bg-win');
	    bgWin?.classList.add('show-image');
	  }, showImageDelay);
	}, []);

  return (
    <div id="bg-win">
      <div id="victoire">T'ES UN WINNER !</div>
      <img id="img_win" alt="win" src={ServietskyWin} />
    </div>
  )
}
