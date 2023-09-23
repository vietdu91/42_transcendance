import React, { useState, useEffect, useContext } from 'react';
import './Decompte.css';
import Cookies from "js-cookie";
import { GameContext } from '../../utils/GameContext';

import KickBaby from '../../../img/game/kick_baby.gif'
import HeadIke from '../../../img/game/ike.png'
import { useNavigate, useLocation } from 'react-router-dom';

export default function Decompte() {
    const token = Cookies.get('accessToken');
    if (!token)
        window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;
    const socket = useContext(GameContext);
    const [countdown, setCountdown] = useState(3);
    const [showKickBaby, setShowKickBaby] = useState(false);
    const [showHeadIke, setShowHeadIke] = useState(false);
    const location = useLocation();
    const { roomId } = location.state;
    const navigate = useNavigate();

    
    useEffect(() => {
        async function beforeUnloadHandler() {
            socket.emit("giveUp", roomId);
        }
        socket.on('gaveUp', () => {
            navigate('/errorgame');
        })
        window.addEventListener('beforeunload', beforeUnloadHandler);
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
                    navigate(`/game/${roomId}`, { state: { roomId: roomId } });
                }, 1000);
            }
        }, 1000);
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
            clearInterval(interval);
        }
    }, [countdown, navigate, roomId, socket]);

    return (
        <div id="decompte_bg">
            {showHeadIke && <img src={HeadIke} alt="HeadIke" id="ike" />}
            <div id="decompte">
                {!showKickBaby && !showHeadIke && <div className={`countdown`}>{countdown}</div>}
                {showKickBaby && <img src={KickBaby} alt="Début du jeu" />}
            </div>
        </div>
    )

}

