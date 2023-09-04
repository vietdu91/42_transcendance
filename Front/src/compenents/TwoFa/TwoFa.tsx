import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import './TwoFa.css';

export default function TwoFa() {
	const navigate = useNavigate();
	const [code, setCode] = useState("");

	const handleChange = (event) => {
		setCode(event.target.value);
	  };

	const handleEnable = async (e) => {
		console.log(code);
		e.preventDefault();
		await axios.post(process.env.REACT_APP_LOCAL_B + '/auth/connect2fa', {code}, {withCredentials: true})
		.then(response => {
			navigate('/');
		})
		.catch(err => {
			console.log(err);
		});
	}

	return (
		<div>
			<form onSubmit={handleEnable}>
				<input placeholder='Enter 2FA code' value={code} onChange={handleChange}></input>
			</form>
		</div>
	)
}