import React, { ReactNode, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Card } from "../interfaces/Card";
import { Player } from "../interfaces/Player";
import { database } from "../services/firebase";
import { shuffle } from "../utils/shuffle";

type RoomContextProviderProps = {
	children: ReactNode;
};

type Room = {
	id: string;
	playersCounter: number;
	createdAt: string;
	players: Player[];
	turn: string;
	deck: Card[];
	winnerPlayerId: string;
	cardsComparison: cardsComparison;
};

type cardsComparison = {
	isComparingCards: boolean;
	attributeBeingCompared: string;
	winnerCardName: string;
};

type RoomContextType = {
	room: Room;
	setRoom: (data: Room) => void;
	createRoom: (room: Room) => Promise<any>;
	updateRoomWithSecondPlayer: (roomId: string) => void;
	getRoomById: (id: string) => Promise<any>;
	updateRoom: (id: string) => void;
	updateGameTurn: (roomId: string, nextPlayerId: string) => void;
	updatePlayerDeck: (playerId: string, cards: Card[]) => void;
	updateRoomWithWinnerPlayer: (winnerPlayerId: string) => void;
	updateRoomIsComparingCards: (
		isComparingCards: boolean,
		attributeBeingCompared: string,
		winnerCardName: string
	) => void;
	removeUser: (user: Player) => void;
	isWaitingSecondPlayer: () => boolean;
};

export const RoomContext = React.createContext({} as RoomContextType);

export function RoomContextProvider({ children }: RoomContextProviderProps) {
	let history = useHistory();
	const [room, setRoom] = useState<Room>({
		id: "",
		playersCounter: 0,
		createdAt: "",
		players: [],
		turn: "",
		deck: [],
		winnerPlayerId: "",
		cardsComparison: {
			isComparingCards: false,
			attributeBeingCompared: "",
			winnerCardName: "",
		},
	});

	async function updateRoom(key: any) {
		await database.ref(`rooms/${key}`).on("value", (roomRef) => {
			if (roomRef.exists()) {
				setRoom(roomRef.val());
			} else {
				// se sala não existe, redireciona pra home
				history.push({
					pathname: `/`,
				});
			}
		});
	}

	async function updateGameTurn(roomId: string, nextPlayerId: string) {
		await database.ref(`rooms/${roomId}`).update({ turn: nextPlayerId });
	}

	async function getRoomById(id: string) {
		let roomResponse = false;
		await database.ref(`/rooms/${id}`).once("value", (room) => {
			if (room.exists()) {
				roomResponse = room.val();
			}
		});
		return roomResponse;
	}

	async function createRoom(room: Room) {
		const roomId = await database.ref(`rooms/`).push(room).key;
		await database.ref(`rooms/${roomId}`).update({ id: roomId });
		return roomId;
	}

	function updateRoomWithSecondPlayer(roomId: any): void {
		database.ref(`rooms/${roomId}`).update({ playersCounter: 2 });
	}

	function updatePlayerDeck(playerId: string, cards: Card[]): void {
		database
			.ref(`rooms/${room?.id}/players/${playerId}`)
			.update({ deck: cards });
	}

	async function updateRoomWithWinnerPlayer(winnerPlayerId: string) {
		await database
			.ref(`rooms/${room.id}`)
			.update({ winnerPlayerId: winnerPlayerId });
	}

	async function updateRoomIsComparingCards(
		isComparingCards: boolean,
		attributeBeingCompared: string,
		winnerCardName: string
	) {
		await database.ref(`rooms/${room.id}`).update({
			cardsComparison: {
				isComparingCards: isComparingCards,
				attributeBeingCompared: attributeBeingCompared,
				winnerCardName: winnerCardName,
			},
		});
	}

	async function removeUser(user: Player) {
		/* pra remover o usuário tem que pegar as cartas dele e devolver pro deck do game, remover o usuário e depois atualizar o contador de players */
		const currentUserDeckFromDatabase = await (
			await database.ref(`rooms/${room.id}/players/${user.id}/deck`).get()
		).val();
		const finalDeck = currentUserDeckFromDatabase.concat(room.deck);
		const updateRoomWithDefaultValues = {
			deck: shuffle(finalDeck),
			playersCounter: Object.keys(room.players).length,
		};
		await database.ref(`rooms/${room.id}`).update(updateRoomWithDefaultValues);
		await database.ref(`rooms/${room.id}/players/${user.id}`).remove();
	}

	function isWaitingSecondPlayer(): boolean {
		return room.playersCounter < 2 ? true : false;
	}

	return (
		<RoomContext.Provider
			value={{
				room,
				setRoom,
				createRoom,
				updateRoomWithSecondPlayer,
				getRoomById,
				updateRoom,
				updateGameTurn,
				updatePlayerDeck,
				updateRoomWithWinnerPlayer,
				updateRoomIsComparingCards,
				removeUser,
				isWaitingSecondPlayer,
			}}
		>
			{children}
		</RoomContext.Provider>
	);
}
