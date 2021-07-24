import { FormEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { database, firebase } from "../services/firebase";
import { v4 as uuidv4 } from "uuid";
import { usePlayer } from "../hooks/usePlayer";
import { useRoom } from "../hooks/useRoom";

export function Home() {
	const history = useHistory();

	const { player, setPlayer } = usePlayer();
	const { room, setRoom, createRoom, addNewPlayer } = useRoom();

	async function handleLogin(event: FormEvent) {
		event.preventDefault();

		if (!player) {
			return;
		}

		// TO DO:
		// 1 - CRIAR UM CONTEXTO DE USUARIO (CURRENT USER) -> OU USAR O PLAYER?
		// 2 - DEPOIS DISSO, FAZER AS 2 VISOES DO PLAYER DAS CARTAS (NG-IF DO ANGULAR)

		// não existe sala, precisa criar
		if (!room) {
			console.log("Home - Criando sala...");
			const roomId = await createRoom(player);
			history.push({
				pathname: `/rooms/${roomId}`,
				state: { roomId: roomId },
			});
		} else if (room.playersCounter < 2) {
			// sala existe, vai ver se já está cheia
			console.log(" Home - Adicionando player...");
			addNewPlayer(player);
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
