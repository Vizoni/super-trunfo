import React, { useEffect, useState } from "react";
import { database, firebase } from "../services/firebase";
import { useHistory, useLocation } from "react-router-dom";
import { Game } from "./Game";
import { Player } from "../interfaces/Player";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useRoom } from "../hooks/useRoom";
import { usePlayers } from "../hooks/usePlayers";
import { useGameDeck } from "../hooks/useGameDeck";

export function Room() {
	const history = useHistory() as any;
	const { currentUser, setCurrentUser, addCardsToDeck } = useCurrentUser();
	const { room } = useRoom();
	const { players, listenToPlayerUpdate } = usePlayers();
	const { deck, generateNewGameDeck, playerBuyCard } = useGameDeck();

	useEffect(() => {
		// atualiza o context Players com os players da sala
		listenToPlayerUpdate(room?.id);
	}, [room]);

	useEffect(() => {
		console.log("usuario entrou na sala...", currentUser?.id);
		const boughtCards = playerBuyCard(2);
		addCardsToDeck(room?.id, boughtCards);
	}, []);

	return (
		<>
			<h1>Usuários logados:</h1>
			{players && (
				<div>
					<div>
						{players.map((player: Player) => {
							return <h3>{player.id}</h3>;
						})}
					</div>
					<Game></Game>
				</div>
			)}
		</>
	);
}
