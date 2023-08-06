import { createContext, useState, useEffect } from 'react';
import io, { Socket } from "socket.io-client";

export const gameSocket = io("http://localhost:3001");
export const GameContext = createContext(gameSocket);

// export const GameProvider = ({ children }) => {
// 	// const [socket, setSocket] = useState<Socket|undefined>();

// 	// useEffect(() => {
		
// 	// 	setSocket(newSocket);

// 	// 	return () => {
// 	// 		newSocket.close();
// 	// 	};
// 	// }, []);

// 	return (
// 		<GameContext.Provider value={socket}>
// 			{children}
// 		</GameContext.Provider>
// 	);
// };