import { FormEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { usePlayers } from "../hooks/usePlayers";
import { useRoom } from "../hooks/useRoom";
import { Player } from "../interfaces/Player";

export function Home() {
	const history = useHistory();

	const { currentUser, setCurrentUser } = useCurrentUser();
	const {
		room,
		setRoom,
		createRoom,
		updateRoomWithSecondPlayer,
		// addPlayerToRoom,
		getRoomById,
		updateRoom,
	} = useRoom();
	const { addPlayerToRoom } = usePlayers();
	const [roomId, setRoomId] = useState<string>();

	async function handleCreateRoom(event: FormEvent) {
		event.preventDefault();

		const newPlayer: Player = {
			id: "",
			createdAt: new Date().toISOString().slice(0, 10),
			deck: [],
		};
		const newRoom = {
			id: "",
			isOpen: true,
			createdAt: new Date().toISOString().slice(0, 10),
			playersCounter: 1,
			players: [],
			turn: "Player 1",
		};

		const roomId = await createRoom(newRoom, newPlayer);
		const playerId = await addPlayerToRoom(roomId, newPlayer);
		// listenToPlayerUpdate(roomId);
		newPlayer.id = playerId;
		setCurrentUser(newPlayer);
		history.push({
			pathname: `/rooms/${roomId}`,
			state: { roomId: roomId },
		});
	}

	async function handleLogin(event: FormEvent) {
		event.preventDefault();
		if (!roomId) return;
		const newPlayer: Player = {
			id: "",
			createdAt: new Date().toISOString().slice(0, 10),
			deck: [],
		};
		const foundRoom = await getRoomById(roomId);
		if (!foundRoom.isOpen) {
			alert("Sala cheia");
			return;
		}
		if (foundRoom) {
			updateRoomWithSecondPlayer(roomId);
			const playerId = await addPlayerToRoom(roomId, newPlayer);
			// listenToPlayerUpdate(roomId);
			newPlayer.id = playerId;
			setCurrentUser(newPlayer);
			updateRoom(roomId);
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
function addPlayerToRoom(roomId: string, newPlayer: Player) {
	throw new Error("Function not implemented.");
}

function updateRoomWithSecondPlayer(roomId: string) {
	throw new Error("Function not implemented.");
}
