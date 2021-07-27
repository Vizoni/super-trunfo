import { FormEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { database, firebase } from "../services/firebase";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useRoom } from "../hooks/useRoom";
import { Player } from "../interfaces/Player";

export function Home() {
	const history = useHistory();

	const { currentUser, setCurrentUser } = useCurrentUser();
	const { room, setRoom, createRoom, addSecondPlayer, getRoomById } = useRoom();
	const [roomId, setRoomId] = useState<string>();

	async function handleCreateRoom(event: FormEvent) {
		event.preventDefault();

		const newPlayer: Player = {
			createdAt: new Date().toISOString().slice(0, 10),
			deck: [],
		};
		const newRoom = {
			isOpen: true,
			createdAt: new Date().toISOString().slice(0, 10),
			playersCounter: 1,
			players: [],
			turn: "Player 1",
		};

		const key = await createRoom(newRoom, newPlayer);
		setCurrentUser(newPlayer);
		history.push({
			pathname: `/rooms/${key}`,
			state: { roomId: key },
		});
	}

	async function handleLogin(event: FormEvent) {
		event.preventDefault();
		if (!roomId) return;
		const newPlayer: Player = {
			createdAt: new Date().toISOString().slice(0, 10),
			deck: [],
		};
		const foundRoom = await getRoomById(roomId);
		console.log("handle login ", foundRoom);
		if (!foundRoom.isOpen) {
			alert("Sala cheia");
			return;
		}
		if (foundRoom) {
			await addSecondPlayer(roomId, newPlayer);
			setCurrentUser(newPlayer);
			history.push({
				pathname: `/rooms/${roomId}`,
				state: { roomId: roomId },
			});
		} else {
			alert(`Não localizamos a sala informada.`);
		}
	}

	return (
		<div>
			<form onSubmit={handleLogin}>
				<input
					type="text"
					placeholder="Código da sala"
					value={roomId}
					onChange={(event) => setRoomId(event.target.value)}
				/>
				<button type="submit">Entrar na sala</button>
				<p>ou</p>
				<button onClick={handleCreateRoom}>Criar Sala</button>
			</form>
		</div>
	);
}
