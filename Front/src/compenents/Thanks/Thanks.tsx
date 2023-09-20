import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import './Thanks.css'

import BigThanks from '../../img/thank_you.jpg';

import end_credit from '../../sounds/end_credit.mp3'

enum User {
	STAFF_1,
	STAFF_2,
	MERCI,
	FRONT,
	BACK,
	FREROTS,
	ROOT,
}

function CreatedBy() {
	const [test, setTest] = useState<User>(User.STAFF_1)
	const navigate = useNavigate();

	useEffect(() => {
		const intervalTime = test === User.ROOT ? 10000 : 1500;
		const interval = setInterval(() => {
			if (test === User.ROOT)
				navigate("/");
			else
				setTest(test + 1);
		}, intervalTime);
		return (() => {
			clearInterval(interval);
		})
		// eslint-disable-next-line
	}, [test]);

	if (test === User.STAFF_1) {
		return (
			<div className="credits" onClick={() => navigate("/")}>
				<div className="title white">Created By</div>
				<div className="subtitle purple">benmoham</div>
				<div className="subtitle orange">dyoula</div>
			</div>
		)
	}
	else if (test === User.STAFF_2) {
		return (
			<div className="credits" onClick={() => navigate("/")}>
				<div className="title white">Created By</div>
				<div className="subtitle green">emtran</div>
				<div className="subtitle cyan">jkaruk</div>
				<div className="subtitle yellow">qujacob</div>
			</div>
		)
	}
	else if (test === User.MERCI) {
		return (
			<div className="credits" onClick={() => navigate("/")}>
				<div className="white title">Gros Merci pour leur Aide</div>
			</div>
		)
	}
	else if (test === User.FRONT) {
		return (
			<div className="credits" onClick={() => navigate("/")}>
				<div className="white title">Les Masters en Front</div>
				<div className="purple subtitle">achane-l</div>
			</div>
		)
	}
	else if (test === User.BACK) {
		return (
			<div className="credits" onClick={() => navigate("/")}>
				<div className="white title">Les Genies du Back</div>
				<div className="subtitle purple">thzeribi</div>
				<div className="yellow subtitle">esafar</div>
			</div>
		)
	}
	else if (test === User.FREROTS) {
		return (
			<div className="credits" onClick={() => navigate("/")}>
				<div className="white title">Les Frerots</div>
				<div className="orange subtitle">lgaducew</div>
				<div className="purple subtitle">bbrassar</div>
			</div>
		)
	}
	else if (test === User.ROOT) {
		return (
			<>
				<div className="credits" onClick={() => navigate("/")}>
					<img className="big_thanks" alt="big_thanks" src={BigThanks}></img>
					<div className="white subtitle">Merci a toi d'avoir teste notre site</div>
					<p className="white">© Comedy Central</p>
				</div>
			</>
		)
	}
	else {
		return (<></>);
	}
}

export default function Thanks() {
	const token = Cookies.get('accessToken');
	if (!token)
		window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;
	return (
		<>
			<iframe src={end_credit} allow="autoplay" id="iframeAudio" title="end_credit_audio"></iframe>
			<CreatedBy />
		</>
	)
}
