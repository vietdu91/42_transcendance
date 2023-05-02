import React from 'react'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'

import './QuoiQuoiDansMesFesses.css'

import Butters from "../../img/video/QUOI_QUOI.mp4"

export default function QuoiQuoiDansMesFesses() {

	const navigate = useNavigate();
	return (
		<>
			<div id="page_credits">
				<video autoPlay loop id="bg" src={Butters}></video>
			</div>
			<div id="return">
				<FontAwesomeIcon icon={faChevronCircleLeft}
				style={{color: "#ff30ff"}} onClick={() => navigate("/")}/>
			</div>
		</>
	)
}
