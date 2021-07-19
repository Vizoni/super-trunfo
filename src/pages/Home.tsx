import { FormEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { database, firebase } from "../services/firebase";
import { v4 as uuidv4 } from "uuid";
import { usePlayer } from "../hooks/usePlayer";

export function Home() {
	const history = useHistory();

	const { player, setPlayer } = usePlayer();

	async function handleLogin(event: FormEvent) {
		event.preventDefault();

		if (!player) {
			return;
		}
		const roomReference = await database.ref(`rooms/`).get();
		console.log("ROOM", roomReference.val());
		if (!roomReference.exists()) {
			// cria o nó da sala no banco
			const firebaseRoom = await database.ref(`rooms/`).push({
				createdAt: new Date().toISOString().slice(0, 10),
				playersCounter: 1,
			});
			// depois da sala criada no banco, seta o nó PLAYERS, pra adicionar o player novo que está chegando
			await database.ref(`rooms/${firebaseRoom.key}/players`).push(player);
			history.push({
				pathname: `/rooms/${firebaseRoom.key}`,
				state: { roomId: firebaseRoom.key },
			});
		} else if (roomReference.val().playersCounter < 2) {
			database.ref(`rooms/`).set({
				...roomReference.val(),
				playersCounter: roomReference.val().playersCounter + 1,
			});
			// pega o ID da primeira sala e entra nela
			await database
				.ref(`rooms/${Object.keys(roomReference.val())[0]}/players`)
				.push(player);
			history.push({
				pathname: `/rooms/${Object.keys(roomReference.val())[0]}`,
				state: { roomId: Object.keys(roomReference.val())[0] },
			});
		} else {
			alert("Não é possível entrar, chegamos ao máximo de players na sala: 2.");
		}
	}

	return (
		<div>
			<form onSubmit={handleLogin}>
				<input
					type="text"
					placeholder="Informe o seu nome"
					value={player ? player.name : ""}
					onChange={(event) =>
						setPlayer({
							id: "",
							name: event.target.value,
							createdAt: new Date().toISOString().slice(0, 10),
							deck: [],
						})
					}
				/>
				<button type="submit" disabled={!player}>
					Entrar na sala
				</button>
			</form>
		</div>
	);
}
