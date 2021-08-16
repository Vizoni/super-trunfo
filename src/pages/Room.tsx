import React, { useEffect, useState } from "react";
import { useGame } from "../hooks/useGame";

export function Room() {
	const { players, room, deck, currentUser, buyCards } = useGame();

	useEffect(() => {
		console.log("--------- ENTROU NA SALA ---------");
		buyCards(2);
	}, []);

	function printStatus() {
		console.log("--------- ATUALIZANDO INFOS ---------");
		console.log("currentUser", currentUser.currentUser);
		console.log("DECK", deck.deck);
		console.log("Players", players.players);
		console.log("Room", room.room);
		console.log("--------- ================ ---------");
	}

	return (
		<>
			<button onClick={printStatus}>Printar info</button>
			<button
				onClick={() => {
					buyCards(1);
				}}
			>
				Comprar cards
			</button>
			<h1>Usuários logados:</h1>
			{/* {players && (
				<div>
					<div>
						{players.map((player: Player) => {
							return <h3>{player.id}</h3>;
						})}
					</div>
					<Game></Game>
				</div>
			)} */}
		</>
	);
}
