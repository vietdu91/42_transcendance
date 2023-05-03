import React from 'react'

import './QuoiQuoiDansMesFesses.css'

import ReturnButtom from '../utils/ReturnButtom/ReturnButtom'

import Butters from "../../img/video/QUOI_QUOI.mp4"

export default function QuoiQuoiDansMesFesses() {

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
