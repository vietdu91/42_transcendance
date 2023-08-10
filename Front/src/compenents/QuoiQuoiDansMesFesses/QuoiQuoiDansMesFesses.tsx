import React from 'react'
import Cookies from "js-cookie";

import './QuoiQuoiDansMesFesses.css'

import ReturnButtom from '../utils/ReturnButtom/ReturnButtom'

import Butters from "../../img/video/QUOI_QUOI.mp4"

export default function QuoiQuoiDansMesFesses() {
	const token = Cookies.get('accessToken');
    if (!token)
        window.location.href = "http://localhost:3000/connect";

	return (
		<>
			<div id="page_credits">
				<video autoPlay loop id="bg" src={Butters}></video>
			</div>
			<div id="return">
				<ReturnButtom colorHexa='#ff30ff' path='/' />
			</div>
		</>
	)
}
