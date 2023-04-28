import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Thanks.css'

enum User{
	STAFF,
	MO,
	ROOT,
}

function CreatedBy(){
	const [test, setTest] = useState<User>(User.STAFF)
	const navigate = useNavigate();

	useEffect(() =>{
		const interval = setInterval(() => {
			if (test === User.ROOT)
			navigate("/");
			else
			setTest(test + 1);
		}, 1300);
		return (() => {
			clearInterval(interval);
		})
	// eslint-disable-next-line
	}, [test]);

	if (test === User.STAFF){
		return (
			<div className="credits">
				<div className="white_title">Created By</div>
				<div className="purple_author">benmoham</div>
				<div className="purple_author">dyoula</div>
				<div className="purple_author">emtran</div>
				<div className="purple_author">jkaruk</div>
				<div className="purple_author">qujacob</div>
			</div>
		)
	}
	else if (test === User.MO){
		return (
			<div className="credits">
				<div className="white_title">Forked By</div>
				<div className="purple_author">achane-l</div>
			</div>
		)
	}
	else if (test === User.ROOT){
		return (
			<div className="credits">
				<div className="white_title">Level By</div>
				<div className="purple_author">emtran</div>
			</div>
		)
	}
	else {
		return(<></>);
	}
}

export default function Thanks() {

	return (
		<CreatedBy />
	)
}
