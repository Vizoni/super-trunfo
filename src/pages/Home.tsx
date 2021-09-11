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
		// if (foundRoom.playersCounter == 2) {
		// 	alert("Sala cheia");
		// 	return;
		// }
		if (foundRoom) {
			await joinRoom(foundRoom);
			// return;
			history.push({
				pathname: `/rooms/${roomId}`,
				state: { roomId: roomId },
			});
		} else {
			alert(`Não localizamos a sala informada.`);
		}
	}

	return (
		<form onSubmit={handleLogin}>
			<div className="home-page">
				<img
					src="../super-trunfo.png"
					className="logo"
					alt="Logo Super Trunfo"
				/>
				<div className="join-room">
					<input
						className="font-join input-join"
						type="text"
						placeholder="Insira o código da sala"
						value={roomId}
						onChange={(event) => setRoomId(event.target.value)}
					/>
					<button className="font-join btn-join-room" type="submit">
						Entrar
					</button>
					<div className="or-divider">
						<span>ou</span>
					</div>
					<div className="create-room">
						<button
							className="btn-create-room font-join"
							onClick={handleCreateRoom}
						>
							Criar Sala
						</button>
					</div>
				</div>
			</div>
		</form>
	);
}
