import React, { useEffect, useState } from "react";
import { database, firebase } from "../services/firebase";
import { useHistory, useLocation } from "react-router-dom";
import { Game } from "./Game";
import { Player } from "../interfaces/Player";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useRoom } from "../hooks/useRoom";

export function Room() {
	const history = useHistory() as any;
	const { currentUser, setCurrentUser } = useCurrentUser();
	const { room, players, setRoom } = useRoom();

	return (
		<>
			<h1>Usuários logados:</h1>
			{players && (
				<div>
					{players.map((player) => {
						return <h3>{player.id}</h3>;
					})}
				</div>
			)}
			{/* {players.length > 0 && <Game players={players}></Game>} */}
		</>
	);
}
