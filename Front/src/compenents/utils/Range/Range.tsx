import React from "react";
import { useState, useEffect } from "react";
import "./Range.css";

export default function Range() {

	const [data, setData] = useState(0);
	const [emoji, setEmoji] = useState('👶');

	useEffect(() => {
		if(data <= 20) {
			setEmoji("👶")
		}
		else if (data <= 40) {
			setEmoji("👦")
		}
		else
			setEmoji("👴")
	},[data])

	const handleChange = (event) => {setData(event.target.value);};

	return (
		<div id="range">
			<h1 id="emoji">{emoji}</h1>
			<input type="range" className={data > 50?'heigh':'less'}
			min='0' max='100' step="1" value={data}
			onChange={handleChange}/>
			<h1 id="age">{data}</h1>
		</div>
	);
}
