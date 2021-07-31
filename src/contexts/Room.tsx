import React, { ReactNode, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { Player } from "../interfaces/Player";
import { database, firebase } from "../services/firebase";

type RoomContextProviderProps = {
	children: ReactNode;
};

type Room = {
	id: string | undefined | null;
	playersCounter: number;
	isOpen: boolean;
	createdAt: string;
	players: Player[] | undefined;
	turn: string;
};

type RoomContextType = {
	room: Room | undefined;
	setRoom: (data: Room) => void;
	createRoom: (room: Room, newPlayer: Player) => Promise<any>;
	updateRoomWithSecondPlayer: (roomId: string) => void;
	addPlayerToRoom: (roomId: string, newPlayer: Player) => Promise<any>;
	getRoomById: (id: string) => Promise<any>;
	updateRoom: (id: string) => void;
	quitPlayer: (roomId: any, playerId: any) => void;
};

export const RoomContext = React.createContext({} as RoomContextType);

export function RoomContextProvider({ children }: RoomContextProviderProps) {
	let history = useHistory();
	const { currentUser } = useCurrentUser();
	const [room, setRoom] = useState<Room | undefined>();
	const [players, setPlayers] = useState<Player[] | undefined>();

	useEffect(() => {
		console.log("ROOM - Context:", room);
	}, [room]);

	async function updateRoom(key: any) {
		database.ref(`rooms/${key}`).on("value", (roomRef) => {
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

	async function getPlayersList() {
		console.log("Room context - getPlayersList", room);
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
		// Atualiza apenas algumas infos da sala
		const updates: any = {};
		updates["playersCounter"] = 2;
		updates["isOpen"] = false;
		database.ref(`rooms/${roomId}`).update(updates);
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
		return playerId;
	}

	function quitPlayer(roomId: any, playerId: any) {
		database.ref(`rooms/${roomId}/players/${playerId}`).remove();
		database.ref(`rooms/${roomId}`).update({
			playersCounter: room ? room.playersCounter - 1 : 1,
			isOpen: true,
		});
	}

	return (
		<RoomContext.Provider
			value={{
				room,
				setRoom,
				createRoom,
				updateRoomWithSecondPlayer,
				addPlayerToRoom,
				getRoomById,
				updateRoom,
				quitPlayer,
			}}
		>
			{children}
		</RoomContext.Provider>
	);
}
