import React from 'react'
import Cookies from "js-cookie";

import './QuoiQuoiDansMesFesses.css'

import ReturnButtom from '../utils/ReturnButtom/ReturnButtom'

import Butters from "../../img/video/QUOI_QUOI.mp4"

export default function QuoiQuoiDansMesFesses() {
	const token = Cookies.get('accessToken');
	if (!token)
		window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;

	return (
		<>
			<div id="page_credits">
				<video autoPlay loop id="bg" src={Butters}></video>
			</div>
			<div id="return">
				<ReturnButtom colorHexa='#DD2DEC' path='/' />
			</div>
		</>
	)
}
