import { FormEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { database, firebase } from "../services/firebase";
import { v4 as uuidv4 } from 'uuid';

export function Home() {
	const history = useHistory();
	const [name, setName] = useState("");

	async function handleLogin(event: FormEvent) {
		// console.log("uid", uuidv4())
		event.preventDefault();

		if (!name) {
			return;
		}
		const roomReference = await database.ref(`rooms/`).get();
		if (!roomReference.exists()) {
			// cria sala e add o usuário à sala
			console.log("data agora", new Date().toISOString())
			const firebaseRoom = await database.ref(`rooms/`).push({createdAt: new Date().toISOString().slice(0, 10)})
			await database.ref(`rooms/${firebaseRoom.key}/players`).push({
				name: name, 
				createdAt: new Date().toISOString().slice(0, 10)
			})
			history.push({
				pathname: `/rooms/${firebaseRoom.key}`,
				state: {roomId: firebaseRoom.key}
			});
		} else {
			// pega o ID da primeira sala e entra nela
			const room = await database.ref("rooms").get();
			await database.ref(`rooms/${Object.keys(room.val())[0]}/players`).push({
				name: name,
				createdAt: new Date().toISOString().slice(0, 10)
			});
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
