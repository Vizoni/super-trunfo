import React, { ReactNode, useEffect, useState } from "react";
import { Card } from "../interfaces/Card";
import { Player } from "../interfaces/Player";
import { database } from "../services/firebase";

type PlayersContextType = {
	players: Player[];
	setPlayers: (data: Player[]) => void;
	listenToPlayerUpdate: (key: any) => void;
	addPlayerToRoom: (roomId: string, player: Player) => Promise<any>;
	addCardsToDeck: (
		roomId: string,
		playerId: string,
		newCards: Card[]
	) => Promise<any>;
	removeFirstCardFromDeck: (roomId: string, playerId: string) => Promise<any>;
};

type PlayersContextProviderProps = {
	children: ReactNode;
};

export const PlayersContext = React.createContext({} as PlayersContextType);

export function PlayersContextProvider({
	children,
}: PlayersContextProviderProps) {
	const [players, setPlayers] = useState<Player[]>([]);

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

	// check if there is already any card on current users deck
	// if already has cards then add the new Cards at the last position
	// if doesn't has cards yet, it add the draw cards to it first position
	async function addCardsToDeck(
		roomId: string,
		playerId: string,
		newCards: Card[]
	) {
		await database
			.ref(`rooms/${roomId}/players/${playerId}/deck`)
			.once("value", (currentDeck) => {
				if (currentDeck.exists()) {
					newCards = [...currentDeck.val(), ...newCards];
				}
				database
					.ref(`rooms/${roomId}/players/${playerId}`)
					.update({ deck: newCards });
			});
	}

	// o card a ser removido sempre será o primeiro do deck do player.
	async function removeFirstCardFromDeck(roomId: string, playerId: string) {
		let cardsUpdated: Card[] = [];
		await database
			.ref(`rooms/${roomId}/players/${playerId}/deck`)
			.once("value", (currentDeck) => {
				if (currentDeck.exists()) {
					if (currentDeck.val().length == 1) {
						cardsUpdated = [];
					} else {
						let currentDeckFromDB = currentDeck.val();
						currentDeckFromDB.splice(0, 1);
						cardsUpdated = currentDeckFromDB;
					}
				}
				database
					.ref(`rooms/${roomId}/players/${playerId}`)
					.update({ deck: cardsUpdated });
			});
	}

	return (
		<PlayersContext.Provider
			value={{
				players,
				setPlayers,
				listenToPlayerUpdate,
				addPlayerToRoom,
				addCardsToDeck,
				removeFirstCardFromDeck,
			}}
		>
			{children}
		</PlayersContext.Provider>
	);
}
