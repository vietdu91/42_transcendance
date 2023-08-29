import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

import './EnCours.css';

import N_ggers from "../../../img/backgrounds/n_ggers.jpg"
import RedCross from "../../../img/buttons/red_cross.png"

import StaticNoise from '../../../img/static_noise.gif';

import CartmanL from "../../../img/en_cours/cartman_left.png"
import CartmanR from "../../../img/en_cours/cartman_right.png"
import GarrisonL from "../../../img/en_cours/garrison_left.png"
import GarrisonR from "../../../img/en_cours/garrison_right.png"
import KennyL from "../../../img/en_cours/kenny_left.png"
import KennyR from "../../../img/en_cours/kenny_right.png"
import TimmyL from "../../../img/en_cours/timmy_left.png"
import TimmyR from "../../../img/en_cours/timmy_right.png"
import TP_L from "../../../img/en_cours/TP_left.png"
import TP_R from "../../../img/en_cours/TP_right.png"
import ButtersL from "../../../img/en_cours/butters_left.png"
import ButtersR from "../../../img/en_cours/butters_right.png"
import HenriettaL from "../../../img/en_cours/henrietta_left.png"
import HenriettaR from "../../../img/en_cours/henrietta_right.png"
import ServietskyL from "../../../img/en_cours/servietsky_left.png"
import ServietskyR from "../../../img/en_cours/servietsky_right.png"

import VS from "../../../img/en_cours/VS.png"

import Loading from "../../utils/Loading/Loading"

export default function EnCours() {

    const [isLoading, setIsLoading] = useState(true);
    const [hoveredPartie, setHoveredPartie] = useState(StaticNoise);

    const navigate = useNavigate();

    useEffect(() => {
	  const timer = setTimeout(() => {
		setIsLoading(false);
	  }, 1500);
  
	  return () => clearTimeout(timer);
	}, []);

    const leavePage = () => {
        navigate(`/gamemenu`);
      };

    function GetLetter({letter}) {

        return (
            <div className="letter_wheel_of_fortune">
                <span className="letter-encours">{letter}</span>
            </div>
        );
    }

    function GetPartie({img_left, img_right}) {

        return (
            <div className="partie" onMouseEnter={() => setHoveredPartie(N_ggers)} onMouseLeave={() => setHoveredPartie(StaticNoise)}>
            {hoveredPartie === N_ggers ? (
                <>
                    <div id="container-partieLeft">
                        <img alt="#" src={img_left} className="partie-playerLeft-img"></img>
                        <div className="partie-playerLeft">emtran</div>
                    </div>
                    <div id="container-partieRight">
                        <img alt="#" src={img_right} className="partie-playerRight-img"></img>
                        <div className="partie-playerRight">dyoula</div>
                    </div>
                    <img alt="#" src={VS} className="versus-encours"></img>
                </>
            ) : (
                <img src={StaticNoise} alt="static_noise" className="partie" />
            )}
        </div>
        );
    }

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="bg-encours">
                    <img className="bg-encours bg-n_ggers" src={N_ggers} alt={'N_ggers'}></img>
                    <img id="red-cross" src={RedCross} onClick={leavePage}></img>
                    <div id="title-encours">
                        <GetLetter letter='P' />
                        <GetLetter letter='A' />
                        <GetLetter letter='R' />
                        <GetLetter letter='T' />
                        <GetLetter letter='I' />
                        <GetLetter letter='E' />
                        <GetLetter letter='S' />
                        <div className="letter_empty">
                            <span className="letter-encours"> </span>
                        </div>
                        <GetLetter letter='E' />
                        <GetLetter letter='N' />
                        <div className="letter_empty">
                            <span className="letter-encours"> </span>
                        </div>
                        <GetLetter letter='C' />
                        <GetLetter letter='O' />
                        <GetLetter letter='U' />
                        <GetLetter letter='R' />
                        <GetLetter letter='S' />                       
                    </div>
                    <div id="parties">
                        <GetPartie img_left={GarrisonL} img_right={GarrisonR} />
                        <GetPartie img_left={KennyL} img_right={KennyR} />
                        <GetPartie img_left={TimmyL} img_right={TimmyR} />
                        <GetPartie img_left={ButtersL} img_right={ButtersR} />
                        <GetPartie img_left={ServietskyL} img_right={ServietskyR} />
                        <GetPartie img_left={HenriettaL} img_right={HenriettaR} />
                        <GetPartie img_left={CartmanL} img_right={CartmanR} />
                        <GetPartie img_left={TP_L} img_right={TP_R} />
                    </div>           
                </div>
            )}
        </>
    );
}
