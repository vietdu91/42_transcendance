import React, { useState, useEffect } from 'react';
import './Decompte.css';

import KickBaby from '../../../img/game/kick_baby.gif'

export default function Decompte() {

    const [countdown, setCountdown] = useState(10);
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {

        const interval = setInterval(() => {
            if (countdown > 1)
                setCountdown(countdown - 1);
            else {
                clearInterval(interval);
                setShowImage(true);
                // code pour navigate sur le jeu + afficher kick bebe
            }
            }, 1000);
        return () => clearInterval(interval);
    }, [countdown]);

    return (
    <div id="decompte">
        <div className="wrapper">
            {!showImage && <div className="countdown"/>}
            {!showImage && <div className="countdown"/>}
            {!showImage && <div className="countdown"/>}
            {!showImage && <div className="countdown"/>}
            {!showImage && <div className="countdown"/>}
            {!showImage && <div className="countdown"/>}
            {!showImage && <div className="countdown"/>}
            {!showImage && <div className="countdown"/>}
            {!showImage && <div className="countdown"/>}
            {!showImage && <div className="countdown"/>}
            {!showImage && <div className="countdown"/>}
            {!showImage && <div className="countdown"/>}
            {!showImage && <div className="countdown"/>}
            {!showImage && <div className="countdown"/>}
            {showImage && <img src={KickBaby} alt="Début du jeu" />}
        </div>
    </div>
    )

}

