import React from 'react'
import { GameContext, gameSocket } from './compenents/utils/GameContext';
// import { ChatContext, chatSocket } from './compenents/utils/ChatContext';

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
import UserProfile from "./compenents/UserProfile/UserProfile"
import Chat from './compenents/Chat/socketChat';

import Achievement from './compenents/utils/Achievement/Achievement';

import ChampSelect from './compenents/Game/ChampSelect/ChampSelect';
import TextComposerContainer from './compenents/Chat/TextComposerContainer/TextComposerContainer';

import YeahYeah from './sounds/win_and_GO/South Park - Bono YEAH YEAH YEAAH(All Of Them).mp3'
import CulbuterTaMere from './sounds/win_and_GO/La Mort.mp3'
import SearchBar from './compenents/searchBar/searchBar';
import SetNickname from './compenents/SetNickname/SetNickname';


export default function App() {
	
	return (
		<GameContext.Provider value={gameSocket}>
			<div className="App">
				<Routes>
        		<Route path="/win" element={<Win />}/>
				<Route path="/" element={<Menu />}/>
				<Route path="/gamemenu" element={<GameMenu />}/>
				<Route path="/2fa" element={<TwoFa />}/>
				<Route path="/setNickname" element={<SetNickname />}/>
				<Route path="/champselect" element={<ChampSelect />}/>
				<Route path="/matchmaking" element={<Matchmaking />}/>
				<Route path="/game" element={<Game />}/>
				<Route path="/game/:roomId" element={<Game />}/>
				<Route path="/connect" element={<Connexion />}/>
				<Route path="/newprofile" element={<NewProfile />}/>
				<Route path="/profile" element={<Profile />}/>
				<Route path="/user/:username" element={<UserProfile />}/>
				<Route path="/chat" element={<Chat />}/>
				<Route path="/credits" element={<Credits />}/>
				<Route path="/thanks" element={<Thanks />}/>
				<Route path="/quoi" element={<QuoiQuoiDansMesFesses />}/>
				<Route path="/achievement" element={<Achievement />}/>
				<Route path="/decompte" element={<Decompte />}/>
				<Route path="/partiesencours" element={<EnCours />}/>
				<Route path="/gameover" element={<GameOver />}/>
				<Route path="/errorgame" element={<GameError />}/>
				<Route path="/404" element={<PageNotFound />}/>
				<Route path="*" element={<Navigate to="/404" />}/>
				</Routes>
			</div>
		</GameContext.Provider>
	)
}
