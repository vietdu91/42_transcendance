import React, {useState} from 'react';

import './TwoFa.css';

export default function TwoFa() {

	const [code, setCode] = useState("");

	const handleChange = (event) => {
		setCode(event.target.value);
	  };

	const handleEnable = async (e) => {
		console.log(code);
		e.preventDefault();
	}

	return (
		<div>
			<form onSubmit={handleEnable}>
				<input placeholder='Enter 2FA code' value={code} onChange={handleChange}></input>
			</form>
		</div>
	)
}