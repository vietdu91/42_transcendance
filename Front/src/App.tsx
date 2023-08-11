import React, { useContext, useState } from 'react'
import { GameContext, gameSocket } from './compenents/utils/GameContext';
import TextField from "@mui/material/TextField";
import List from "./compenents/List/List"

// CSS
import './App.css';

// PACKAGES
import { Routes, Route } from "react-router-dom"
import axios from "axios"

// COMPONENTS
import Menu from "./compenents/Menu/Menu"
import Connexion from "./compenents/Connexion/Connexion"
import Credits from "./compenents/Credits/Credits"
import PageNotFound from "./compenents/PageNotFound/PageNotFound"
import Thanks from "./compenents/Thanks/Thanks"
import QuoiQuoiDansMesFesses from "./compenents/QuoiQuoiDansMesFesses/QuoiQuoiDansMesFesses"
import GameMenu from "./compenents/Game/GameMenu/GameMenu"
import Decompte from "./compenents/Game/Decompte/Decompte"
import Game from "./compenents/Game/Game/Game"
import Win from "./compenents/Game/Win/Win"
import GameOver from "./compenents/Game/GameOver/GameOver"
import GameError from "./compenents/Game/GameError/GameError"
import Matchmaking from "./compenents/Game/Matchmaking/Matchmaking"
import NewProfile from "./compenents/NewProfile/NewProfile"
import Profile from "./compenents/Profile/Profile"
import Test from "./compenents/Test"
import CharacterSelection from './compenents/CharacterSelection/CharacterSelection';
import Chat from './compenents/Chat/socketChat';

import MusicPlayer from './compenents/utils/MusicPlayer/MusicPlayer';
import Achievement from './compenents/utils/Achievement/Achievement';

// SOUNDS
import queer_eye from './sounds/queer_eye.mp3'
import southparkSound from './sounds/theme_song.mp3'
import end_credit from './sounds/end_credit.mp3'
import choose_your_fighter from './sounds/choose_your_fighter.mp3'
import ChampSelect from './compenents/Game/ChampSelect/ChampSelect';


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
	const [inputText, setInputText] = useState("");
  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
};

	return (
		<GameContext.Provider value={gameSocket}>
			<div className="App">
				<Routes>
				<Route path="/" element={<MenuWithMusic />}/>
				<Route path="/select" element={<CharacterSelectionWithMusic />}/>
				<Route path="/gamemenu" element={<GameMenu />}/>
				<Route path="/champselect" element={<ChampSelect />}/>
				<Route path="/matchmaking" element={<Matchmaking />}/>
				<Route path="/game" element={<Game />}/>
				<Route path="/game/:roomId" element={<Game />}/>
				<Route path="/connect" element={<ConnexionWithMusic />}/>
				<Route path="/newprofile" element={<NewProfile />}/>
				<Route path="/profile" element={<Profile />}/>
				<Route path="/chat" element={<Chat />}/>
				<Route path="/credits" element={<CreditsWithMusic />}/>
				<Route path="/thanks" element={<ThanksWithMusic />}/>
				<Route path="/quoi" element={<QuoiQuoiDansMesFesses />}/>
				<Route path="/achievement" element={<Achievement />}/>
				<Route path="/decompte" element={<Decompte />}/>
				<Route path="/gameover" element={<GameOver />}/>
				<Route path="/errorgame" element={<GameError />}/>
        		<Route path="/win" element={<Win />}/>
				<Route path="/404" element={<PageNotFound />}/>
				<Route path="/list" element={<List />}/>
				</Routes>
					<div className="main">
						<h1>React Search</h1>
					<div className="search">
						<TextField
							id="outlined-basic"
							onChange={inputHandler}
							variant="outlined"
							fullWidth
							label="Search"
						/>
					</div>
						<List input={inputText} />
					</div>
			</div>
		</GameContext.Provider>
	)
}
//<Route path="*" element={<Navigate to="/404" />}/>
