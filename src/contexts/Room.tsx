import React, { ReactNode, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { Player } from "../interfaces/Player";
import { database, firebase } from "../services/firebase";

type RoomContextType = {
	room: Room | undefined;
	setRoom: (data: Room) => void;
	createRoom: (firstPlayer: Player) => void;
	addNewPlayer: (secondPlayer: Player) => void;
};

type RoomContextProviderProps = {
	children: ReactNode;
};

type Room = {
	id: string | null;
	playersCounter: number;
	isOpen: boolean;
	createdAt: string;
	players: Player[];
	turn: string;
};

export const RoomContext = React.createContext({} as RoomContextType);

export function RoomContextProvider({ children }: RoomContextProviderProps) {
	const { currentUser } = useCurrentUser();
	const [room, setRoom] = useState<Room | undefined>();

	useEffect(() => {
		updateRoom();
	}, []);

	async function updateRoom() {
		database.ref("rooms").on("value", (roomRef) => {
			if (roomRef.exists()) {
				setRoom(roomRef.val()[Object.keys(roomRef.val())[0]]);
			}
		});
	}

	async function createRoom(firstPlayer: Player) {
		const firebaseRoom = await database.ref(`rooms/`).push({
			createdAt: new Date().toISOString().slice(0, 10),
			playersCounter: 1,
			turn: "Player 1",
		});
		const playerId = database
			.ref(`rooms/${firebaseRoom.key}/players`)
			.set([firstPlayer]);
		database.ref(`rooms/${firebaseRoom.key}`).update({ id: firebaseRoom.key });
		updateRoom();
		return firebaseRoom.key;
	}

	async function addNewPlayer(player: Player) {
		let arrayPlayers = [];
		arrayPlayers = room ? room.players : [];
		arrayPlayers.push(player);
		const updates: any = {};
		updates[`players`] = arrayPlayers;
		updates[`playersCounter`] = room ? room.playersCounter + 1 : 2;
		database.ref(`rooms/${room?.id}`).update(updates);
	}

	return (
		<RoomContext.Provider value={{ room, setRoom, createRoom, addNewPlayer }}>
			{children}
		</RoomContext.Provider>
	);
}
