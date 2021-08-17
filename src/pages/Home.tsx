import { FormEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useGame } from "../hooks/useGame";

export function Home() {
	const history = useHistory();

	const { createNewRoom, findRoom, joinRoom } = useGame();
	const [roomId, setRoomId] = useState<string>();

	async function handleCreateRoom(event: FormEvent) {
		event.preventDefault();
		const roomId = await createNewRoom();
		history.push({
			pathname: `/rooms/${roomId}`,
			state: { roomId: roomId },
		});
	}

	async function handleLogin(event: FormEvent) {
		event.preventDefault();
		if (!roomId) return;
		const foundRoom = await findRoom(roomId);
		if (foundRoom.playersCounter == 2) {
			alert("Sala cheia");
			return;
		}
		if (foundRoom) {
			await joinRoom(foundRoom);
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
