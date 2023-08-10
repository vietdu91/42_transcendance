import React, { useState, useEffect } from 'react';
import './Decompte.css';
import { count } from 'console';

import KickBaby from '../../../img/game/kick_baby.gif'
import HeadIke from '../../../img/game/ike.png'
import { useNavigate, useLocation } from 'react-router-dom';

export default function Decompte() {

    const [countdown, setCountdown] = useState(3);
    const [showKickBaby, setShowKickBaby] = useState(false);
    const [showHeadIke, setShowHeadIke] = useState(false);
    const location = useLocation();
	const { roomId } = location.state;
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            if (countdown > 1) {
                setCountdown(countdown - 1);
            } else {
                clearInterval(interval);
                setShowKickBaby(true);
                setTimeout(() => {
                    setShowHeadIke(true);
                }, 500);
                setTimeout(() => {
                    setShowHeadIke(false);
                    navigate(`/game/${roomId}`, {state: {roomId: roomId}});
                }, 1000);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [countdown]);

    return (
    <div id="decompte_bg">
        {showHeadIke && <img src={HeadIke} alt="HeadIke" id="ike"/>}
        <div id="decompte">
            {!showKickBaby && !showHeadIke && <div className={`countdown`}>{countdown}</div>}
            {showKickBaby && <img src={KickBaby} alt="Début du jeu" />}
        </div>
    </div>
    )

}

