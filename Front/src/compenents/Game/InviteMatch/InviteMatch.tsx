import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import { GameContext } from "../../utils/GameContext";

export default function InviteMatch() {

	const token = Cookies.get('accessToken');
	if (!token)
		window.location.href = `${process.env.REACT_APP_LOCAL_F}/connect`;
	const socket = useContext(GameContext);
	const navigate = useNavigate();
	const location = useLocation();
	const otherName = location.search.slice(location.search.lastIndexOf('=') + 1);

	useEffect(() => {
		async function getUser() {
			await axios.get(
				process.env.REACT_APP_LOCAL_B + '/profile/getUserByname',
				{ withCredentials: true, params: { username: otherName }, headers: { "Authorization": `Bearer ${token}` } })
				.catch((error) => {
					console.log(error);
					navigate('/chat');
				})
		}
		if (location.search && location.search.slice(0, location.search.indexOf('=') + 1) === "?other=")
			getUser();
		else
			navigate('/chat');
		socket.on('alreadyJoined', (res) => {
			console.log(res.message);
			navigate("/chat");
		})
		socket.on('matchFound', (res) => {
			navigate(`/decompte`, { state: { roomId: res.roomId } });
		})
		socket.on('hihihiha !', (res) => {
			console.log("YAAAAAAAAAA");
		})
		socket.on('inviteJoined', (res) => {
			console.log(res.message);
		})

		window.addEventListener('beforeunload', () => {
			socket.emit("leaveInvite");
		})

		socket?.emit('joinInvite', {name: otherName});
	})

	return (
		<div>
			Waiting...
		</div>
	)
}