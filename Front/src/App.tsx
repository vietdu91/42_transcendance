import React from 'react'

// CSS
import './App.css';

// PACKAGES
import { Routes, Route } from "react-router-dom"

// COMPONENTS
import Menu from "./compenents/Menu/Menu"
import Connexion from "./compenents/Connexion/Connexion"
import Credits from "./compenents/Credits/Credits"
import PageNotFound from "./compenents/PageNotFound/PageNotFound"
import Thanks from "./compenents/Thanks/Thanks"
import QuoiQuoiDansMesFesses from "./compenents/QuoiQuoiDansMesFesses/QuoiQuoiDansMesFesses"
import Game from "./compenents/Game/Game"
import NewProfile from "./compenents/NewProfile/NewProfile"
import Test from "./compenents/Test"
import CharacterSelection from './compenents/CharacterSelection/CharacterSelection';

import MusicPlayer from './compenents/utils/MusicPlayer/MusicPlayer';

// SOUNDS
import queer_eye from './sounds/queer_eye.mp3'
import southparkSound from './sounds/theme_song.mp3'
import end_credit from './sounds/end_credit.mp3'
import choose_your_fighter from './sounds/choose_your_fighter.mp3'

const ConnexionWithMusic = () => (
  <>
    <MusicPlayer audioSrc={southparkSound} delay={5000}/>
    <Connexion />
  </>
);

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

const ThanksWithMusic = () => (
  <>
    <MusicPlayer audioSrc={end_credit} />
    <Thanks />
  </>
);

const CharacterSelectionWithMusic = () => (
  <>
    <MusicPlayer audioSrc={choose_your_fighter} />
    <CharacterSelection />
  </>

);

export default function App() {

  return (

		<div className="App">
      <Routes>
        <Route path="/test" element={<Test />}/>
        <Route path="/" element={<MenuWithMusic />}/>
        <Route path="/select" element={<CharacterSelectionWithMusic />}/>
        <Route path="/game" element={<Game />}/>
        <Route path="/connect" element={<ConnexionWithMusic />}/>
        <Route path="/newprofile" element={<NewProfile />}/>
        <Route path="/credits" element={<CreditsWithMusic />}/>
        <Route path="/thanks" element={<ThanksWithMusic />}/>
        <Route path="/quoi" element={<QuoiQuoiDansMesFesses />}/>
        <Route path="/404" element={<PageNotFound />}/>
      </Routes>
		</div>
  )
}
//<Route path="*" element={<Navigate to="/404" />}/>

