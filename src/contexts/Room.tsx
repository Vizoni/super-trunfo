import React, { ReactNode, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { Player } from "../interfaces/Player";
import { database, firebase } from "../services/firebase";

type RoomContextProviderProps = {
	children: ReactNode;
};

type Room = {
	// id: string | undefined;
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
	addSecondPlayer: (roomId: string, newPlayer: Player) => void;
	getRoomById: (id: string) => Promise<any>;
	updateRoom: (id: string) => void;
};

export const RoomContext = React.createContext({} as RoomContextType);

export function RoomContextProvider({ children }: RoomContextProviderProps) {
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
		const ref = await database.ref(`rooms/`).push(room);
		await updateRoom(ref.key);
		database.ref(`rooms/${ref.key}/players`).push(newPlayer);
		return ref.key;
	}

	function addSecondPlayer(roomId: any, newPlayer: Player): void {
		const updates: any = {};
		updates["playersCounter"] = 2;
		updates["isOpen"] = false;
		database.ref(`rooms/${roomId}`).update(updates);
		database.ref(`rooms/${roomId}/players`).push(newPlayer);
	}

	return (
		<RoomContext.Provider
			value={{
				room,
				setRoom,
				createRoom,
				addSecondPlayer,
				getRoomById,
				updateRoom,
			}}
		>
			{children}
		</RoomContext.Provider>
	);
}
