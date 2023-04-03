import React from 'react'
import {Link} from 'react-router-dom'

export default function NavBarMenu() {
	return (
		<nav>
      		<Link to="/">Accueil</Link>
      		<Link to="/score">Score</Link>
      	</nav>
	)
}
