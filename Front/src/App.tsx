import React from 'react'

// CSS
import './App.css';

// PACKAGES
import { Routes, Route, Navigate } from "react-router-dom"

// COMPONENTS
import Menu from "./compenents/Menu/Menu"
import Connexion from "./compenents/Connexion/Connexion"
import Credits from "./compenents/Credits/Credits"
import PageNotFound from "./compenents/PageNotFound/PageNotFound"

import MusicPlayer from './compenents/MusicPlayer/MusicPlayer';

// SOUNDS
import queer_eye from './sounds/queer_eye.mp3'
import southparkSound from './sounds/theme_song.mp3';

const MenuWithMusic = () => (
  <>
    <MusicPlayer audioSrc={southparkSound} />
    <Menu />
  </>
);

const CreditsWithMusic = () => (
  <>
    <MusicPlayer audioSrc={queer_eye} />
    <Credits />
  </>
);

export default function App() {

  return (

		<div className="App">
      <Routes>
        <Route path="/" element={<MenuWithMusic />}/>
        <Route path="/connect" element={<Connexion />}/>
        <Route path="/credits" element={<CreditsWithMusic />}/>
        <Route path="/404" element={<PageNotFound />}/>
        <Route path="*" element={<Navigate to="/404" />}/>
      </Routes>
		</div>
  )
}

