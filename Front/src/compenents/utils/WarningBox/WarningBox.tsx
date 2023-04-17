import React, { useState } from 'react';

import './WarningBox.css';

import ChristianRock from "../../../img/christian_rock.png"

export default function WarningBox() {

  const [isVisible, setIsVisible] = useState(true);

  function handleDelete() {
    setIsVisible(false);
  }

  return (
    isVisible && (
      <div className="warning-box">
	  	  <div id="attention">ATTENTION</div>
        <img id="rock" alt="christian_rock" src={ChristianRock}></img>
        <div id="message">
          Desactive les restrictions de ton navigateur pour profiter pleinement de l'experience audio de ce putain de merveilleux site.        </div>
        <button id="move_on" onClick={handleDelete}></button>
      </div>
    )
  );
};
