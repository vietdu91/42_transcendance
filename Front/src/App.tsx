import React from 'react'

// CSS
import './App.css';

// PACKAGES
import { Routes, Route } from "react-router-dom"

// COMPONENTS
import Menu from "./compenents/Menu"
import Score from "./compenents/Score"
import Connexion from "./compenents/Connexion"

export default function App() {

  return (

		<div className="App">
      <Routes>
        <Route path="/" element={<Menu />}/>
        <Route path="/score" element={<Score />}/>
        <Route path="/connect" element={<Connexion />}/>
      </Routes>
		</div>
  )
}

