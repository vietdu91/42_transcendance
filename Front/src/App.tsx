import React, { createContext, useState, useEffect } from 'react'

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
import Game from "./compenents/Game/Game/Game"
import Matchmaking from "./compenents/Game/Matchmaking/Matchmaking"
import NewProfile from "./compenents/NewProfile/NewProfile"
import Profile from "./compenents/Profile/Profile"
import Test from "./compenents/Test"
import CharacterSelection from './compenents/CharacterSelection/CharacterSelection';
import Chat from './compenents/Chat/socketChat';

import MusicPlayer from './compenents/utils/MusicPlayer/MusicPlayer';

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

export interface User {
	user: {
		id:number;
		email:string;
		name:string;
		twoFA:boolean;
		nick:string;
		age:number;
	},
	setUser: React.Dispatch<React.SetStateAction<{
		id?:number;
		email?:string;
		name?:string;
		twoFA?:boolean;
		nick?:string;
		age?:number;
	}>>;
}

export const UserContext = createContext<User>({
  user: {
	id: -1,
	email: '',
	name: '',
	twoFA: false,
	nick: '',
	age: -1,
  },
  setUser: () => {},
});

export default function App() {
	const [contextData, setContextData] = useState<User>({
		user: {
			id: -1,
			email: '',
			name: '',
			twoFA: false,
			nick: '',
			age: -1,
		},
			setUser: () => {},
  	})

	return (
		<UserContext.Provider value={contextData}>
			<div className="App">
				<Routes>
				<Route path="/test" element={<Test />}/>
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
				<Route path="/404" element={<PageNotFound />}/>
				</Routes>
			</div>
		</UserContext.Provider>
	)
}
//<Route path="*" element={<Navigate to="/404" />}/>

