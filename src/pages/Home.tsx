import { FormEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { database, firebase } from "../services/firebase";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useRoom } from "../hooks/useRoom";

export function Home() {
	const history = useHistory();

	const { currentUser, setCurrentUser } = useCurrentUser();
	const { room, setRoom, createRoom, addNewPlayer } = useRoom();

	async function handleLogin(event: FormEvent) {
		event.preventDefault();

		if (!currentUser) {
			return;
		}

		// TO DO:
		// 1 - CRIAR UM CONTEXTO DE USUARIO (CURRENT USER) -> OU USAR O PLAYER?
		// 2 - DEPOIS DISSO, FAZER AS 2 VISOES DO PLAYER DAS CARTAS (NG-IF DO ANGULAR)

		// não existe sala, precisa criar
		if (!room) {
			console.log("Home - Criando sala...");
			const roomId = await createRoom(currentUser);
			history.push({
				pathname: `/rooms/${roomId}`,
				state: { roomId: roomId },
			});
		} else if (room.playersCounter < 2) {
			// sala existe, vai ver se já está cheia
			console.log(" Home - Adicionando player...");
			addNewPlayer(currentUser);
			history.push({
				pathname: `/rooms/${room.id}`,
				state: { roomId: room.id },
			});
		} else {
			// sala está cheia!
			alert("nao pode entrar...");
		}
	}

	return (
		<div>
			<form onSubmit={handleLogin}>
				<input
					type="text"
					placeholder="Informe o seu nome"
					value={currentUser ? currentUser.name : ""}
					onChange={(event) =>
						setCurrentUser({
							id: uuidv4(),
							name: event.target.value,
							createdAt: new Date().toISOString().slice(0, 10),
							deck: [],
						})
					}
				/>
				<button type="submit" disabled={!currentUser}>
					Entrar na sala
				</button>
			</form>
		</div>
	);
}
