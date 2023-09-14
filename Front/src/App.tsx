import React from 'react'
import { GameContext, gameSocket } from './compenents/utils/GameContext';
import { ChatContext, chatSocket } from './compenents/utils/ChatContext';

// CSS
import './App.css';

// PACKAGES
import { Routes, Route, Navigate } from "react-router-dom"

// COMPONENTS
import Menu from "./compenents/Menu/Menu"
import Connexion from "./compenents/Connexion/Connexion"
import TwoFa from "./compenents/TwoFa/TwoFa"
import Credits from "./compenents/Credits/Credits"
import PageNotFound from "./compenents/PageNotFound/PageNotFound"
import Thanks from "./compenents/Thanks/Thanks"
import QuoiQuoiDansMesFesses from "./compenents/QuoiQuoiDansMesFesses/QuoiQuoiDansMesFesses"
import GameMenu from "./compenents/Game/GameMenu/GameMenu"
import EnCours from "./compenents/Game/EnCours/EnCours"
import Decompte from "./compenents/Game/Decompte/Decompte"
import Game from "./compenents/Game/Game/Game"
import Win from "./compenents/Game/Win/Win"
import GameOver from "./compenents/Game/GameOver/GameOver"
import GameError from "./compenents/Game/GameError/GameError"
import Matchmaking from "./compenents/Game/Matchmaking/Matchmaking"
import NewProfile from "./compenents/NewProfile/NewProfile"
import Profile from "./compenents/Profile/Profile"
import Chat from './compenents/Chat/socketChat';

import MusicPlayer from './compenents/utils/MusicPlayer/MusicPlayer';
import Achievement from './compenents/utils/Achievement/Achievement';

// SOUNDS
import queer_eye from './sounds/queer_eye.mp3'
import southparkSound from './sounds/theme_song.mp3'
import end_credit from './sounds/end_credit.mp3'
import choose_your_fighter from './sounds/choose_your_fighter.mp3'
import ChampSelect from './compenents/Game/ChampSelect/ChampSelect';

import YeahYeah from './sounds/win_and_GO/South Park - Bono YEAH YEAH YEAAH(All Of Them).mp3'
import CulbuterTaMere from './sounds/win_and_GO/La Mort.mp3'


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

const ChampSelectWithMusic = () => (
	<>
	<MusicPlayer audioSrc={choose_your_fighter} />
	<ChampSelect />
  </>
);

const WinWithMusic = () => {

	return (
	<>
		<MusicPlayer audioSrc={YeahYeah} />
		<Win />
	  </>
	);
};

const GameOverWithMusic = () => {

	return (
	<>
		<MusicPlayer audioSrc={CulbuterTaMere} />
		<GameOver />
	</>
	
	)
}


export default function App() {
	
	return (
		<GameContext.Provider value={gameSocket}>
			<div className="App">
				<Routes>
        		<Route path="/win" element={<WinWithMusic />}/>
				<Route path="/" element={<MenuWithMusic />}/>
				<Route path="/gamemenu" element={<GameMenu />}/>
				<Route path="/2fa" element={<TwoFa />}/>
				<Route path="/champselect" element={<ChampSelectWithMusic />}/>
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
				<Route path="/partiesencours" element={<EnCours />}/>
				<Route path="/gameover" element={<GameOverWithMusic />}/>
				<Route path="/errorgame" element={<GameError />}/>
				<Route path="/404" element={<PageNotFound />}/>
				<Route path="*" element={<Navigate to="/404" />}/>
				</Routes>
			</div>
		</GameContext.Provider>
	)
}
