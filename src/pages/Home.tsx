import { FormEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { database, firebase } from "../services/firebase";

export function Home() {
	const history = useHistory();
	const [name, setName] = useState("");

	async function handleLogin(event: FormEvent) {
		event.preventDefault();

		if (!name) {
			return;
		}
		const roomReference = await database.ref(`rooms/`).get();
		if (!roomReference.exists()) {
			// cria sala e entra nela
			const firebaseRoom = await database.ref(`rooms/`).push({
				players: [
					{
						name: name,
					},
				],
			});
			history.push(`/rooms/${firebaseRoom.key}`);
		} else {
			// pega o ID da primeira sala e entra nela
			const room = await database.ref("rooms").get();
			await database.ref(`rooms/${Object.keys(room.val())[0]}/players`).push({
				name: name,
			});
			// history.push(`/rooms/${Object.keys(room.val())[0]}`);
			history.push({
				pathname: `/rooms/${Object.keys(room.val())[0]}`,
				state: {roomId: Object.keys(room.val())[0]}
			});
		}
	}

	return (
		<div>
			<form onSubmit={handleLogin}>
				<input
					type="text"
					placeholder="Informe o seu nome"
					value={name}
					onChange={(event) => setName(event.target.value)}
				/>
				<button type="submit" disabled={!name}>
					Entrar na sala
				</button>
			</form>
		</div>
	);
}
