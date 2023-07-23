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
	id:number;
	setId:React.Dispatch<React.SetStateAction<number>>;
	email:string;
	setEmail:React.Dispatch<React.SetStateAction<string>>;
	name:string;
	setName:React.Dispatch<React.SetStateAction<string>>;
	twoFA:boolean;
	setTwoFA:React.Dispatch<React.SetStateAction<boolean>>;
	nick:string;
	setNick:React.Dispatch<React.SetStateAction<string>>;
	age:number;
	setAge:React.Dispatch<React.SetStateAction<number>>;
}

export const UserContext = createContext<User>({} as User);

export default function App() {
	const [id, setId] = useState(-1);
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [twoFA, setTwoFA] = useState(false);
	const [nick, setNick] = useState('');
	const [age, setAge] = useState(-1);

	return (
		<UserContext.Provider value={{id, setId, email, setEmail, name, setName, twoFA, setTwoFA, nick, setNick, age, setAge}}>
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

