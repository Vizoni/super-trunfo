import React, { ReactNode, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { usePlayers } from "../hooks/usePlayers";
import { Card } from "../interfaces/Card";
import { Player } from "../interfaces/Player";
import { database, firebase } from "../services/firebase";

type RoomContextProviderProps = {
	children: ReactNode;
};

type Room = {
	id: string;
	playersCounter: number;
	createdAt: string;
	players: any;
	turn: string;
};

type RoomContextType = {
	room: Room | undefined;
	setRoom: (data: Room) => void;
	createRoom: (room: Room, newPlayer: Player) => Promise<any>;
	updateRoomWithSecondPlayer: (roomId: string) => void;
	getRoomById: (id: string) => Promise<any>;
	updateRoom: (id: string) => void;
	updatePlayerDeck: (playerId: string, cards: Card[]) => void;
};

export const RoomContext = React.createContext({} as RoomContextType);

export function RoomContextProvider({ children }: RoomContextProviderProps) {
	let history = useHistory();
	const [room, setRoom] = useState<Room>();
	// const { players, setPlayers } = usePlayers();

	async function updateRoom(key: any) {
		await database.ref(`rooms/${key}`).on("value", (roomRef) => {
			if (roomRef.exists()) {
				console.log("UPDATE ROOM ATUALIZANDO...", roomRef.val());
				setRoom(roomRef.val());
			} else {
				// se sala não existe, redireciona pra home
				history.push({
					pathname: `/`,
				});
			}
		});
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

	async function createRoom(room: Room, newPlayer: Player) {
		/* Cria uma sala e atualiza no DB o ID gerado dessa sala
		Atualiza o context (updateRoom) */
		const roomId = await database.ref(`rooms/`).push(room).key;
		await database.ref(`rooms/${roomId}`).update({ id: roomId });
		await updateRoom(roomId);
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

	return (
		<RoomContext.Provider
			value={{
				room,
				setRoom,
				createRoom,
				updateRoomWithSecondPlayer,
				getRoomById,
				updateRoom,
				updatePlayerDeck,
			}}
		>
			{children}
		</RoomContext.Provider>
	);
}
