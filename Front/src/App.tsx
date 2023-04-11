import React from 'react'

// CSS
import './App.css';

// PACKAGES
import { Routes, Route, Navigate } from "react-router-dom"

// COMPONENTS
import Menu from "./compenents/Menu/Menu"
import Connexion from "./compenents/Connexion/Connexion"
import PageNotFound from "./compenents/PageNotFound/PageNotFound"

export default function App() {

  return (

		<div className="App">
      <Routes>
        <Route path="/" element={<Menu />}/>
        <Route path="/connect" element={<Connexion />}/>
        <Route path="/404" element={<PageNotFound />}/>
        <Route path="*" element={<Navigate to="/404" />}/>
      </Routes>
		</div>
  )
}

