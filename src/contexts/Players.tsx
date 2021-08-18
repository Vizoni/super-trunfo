import React, { ReactNode, useEffect, useState } from "react";
import { Card } from "../interfaces/Card";
import { Player } from "../interfaces/Player";
import { database } from "../services/firebase";

type PlayersContextType = {
	players: Player[];
	setPlayers: (data: Player[]) => void;
	listenToPlayerUpdate: (key: any) => void;
	addPlayerToRoom: (roomId: string, player: Player) => Promise<any>;
	setPlayersDeck: (
		roomId: string | undefined,
		newCards: Card[],
		halfDeckIndex: string
	) => Promise<any>;
};

type PlayersContextProviderProps = {
	children: ReactNode;
};

export const PlayersContext = React.createContext({} as PlayersContextType);

export function PlayersContextProvider({
	children,
}: PlayersContextProviderProps) {
	const [players, setPlayers] = useState<Player[]>([]);

	// useEffect(() => {
	// 	console.log("useeffect", players);
	// }, players);

	async function listenToPlayerUpdate(roomId: any) {
		let playerList: Player[] = [];
		// console.log("========= players: roomId", roomId);
		await database
			.ref(`rooms/${roomId}/players`)
			.on("value", (playersFromDatabase) => {
				if (playersFromDatabase.val()) {
					// console.log("=== PLAYERS", playersFromDatabase.val());
					let arrayOfPlayers = Object.keys(playersFromDatabase.val());
					// console.log("=== arrayOfPlayers", arrayOfPlayers);
					arrayOfPlayers.forEach((singlePlayer, index) => {
						playerList.push(playersFromDatabase.val()[singlePlayer]);
					});
					// console.log("=== PLAYERSLIST", playerList);
					setPlayers(playerList);
					playerList = [];
				}
			});
	}

	async function addPlayerToRoom(roomId: any, newPlayer: Player): Promise<any> {
		/* Cria um novo jogador na sala e atualiza no DB o ID gerado desse player
		A setagem do ID do currentUser é feito na Home!  */
		const playerId = await database
			.ref(`rooms/${roomId}/players`)
			.push(newPlayer).key;
		await database
			.ref(`rooms/${roomId}/players/${playerId}`)
			.update({ id: playerId });
		listenToPlayerUpdate(roomId);
		return playerId;
	}

	async function setPlayersDeck(
		roomId: string | undefined,
		shuffledCards: Card[],
		halfDeckIndex: string
	): Promise<any> {
		// console.log("player context - setplayerdeck");
		// const a = await database
		// 	.ref(`rooms/${roomId}/players`)
		// 	.
		// .once("value", (players) => {
		// 	if (players.val()) {
		// 		let arrayOfPlayers = Object.keys(players.val());
		// 		arrayOfPlayers.forEach((player, index) => {
		// 			playerList.push(players.val()[player]);
		// 		});
		// 	}
		// });
		// database.ref(`rooms/${roomId}/players/${playerId}`).set({ deck: newCards });
	}

	return (
		<PlayersContext.Provider
			value={{
				players,
				setPlayers,
				listenToPlayerUpdate,
				addPlayerToRoom,
				setPlayersDeck,
			}}
		>
			{children}
		</PlayersContext.Provider>
	);
}
