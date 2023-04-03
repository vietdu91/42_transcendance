import React from 'react'
import { useNavigate } from "react-router-dom";

export default function NavBarMenu() {
	const navigate = useNavigate();

	return (
		<div>
			<button onClick={() => navigate("/score")}>yo</button>
		</div>
	)
}
