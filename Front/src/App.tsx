import React from 'react'

// CSS
import './App.css';

// PACKAGES
import { Routes, Route } from "react-router-dom"

// COMPONENTS
import Menu from "./compenents/Menu"
import Score from "./compenents/Score"

export default function App() {

  return (

		<div className="App">
      <Routes>
        <Route path="/" element={<Menu />}></Route>
        <Route path="/score" element={<Score />}/>
      </Routes>
		</div>
  )
}

