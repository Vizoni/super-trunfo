import React, { useEffect, useState } from "react";
import { useGame } from "../hooks/useGame";

export function Room() {
	const {
		players,
		room,
		deck,
		currentUser,
		buyCards,
		listenToPlayerJoiningRoom,
		listenToDeckUpdate,
	} = useGame();

	useEffect(() => {
		console.log("--------- ENTROU NA SALA ---------");
		listenToPlayerJoiningRoom();
		listenToDeckUpdate();
		console.log("currentUser", currentUser.currentUser);
		console.log("DECK", deck);
		console.log("Players", players);
		console.log("Room", room);
		setTimeout(() => {
			buyCards(2);
		}, 5000);
		// const boughtCards = playerBuyCard(2);
		// addCardsToDeck(room?.id, boughtCards);
	}, []);

	function printStatus() {
		console.log("--------- ATUALIZANDO INFOS ---------");
		console.log("currentUser", currentUser.currentUser);
		console.log("DECK", deck);
		console.log("Players", players);
		console.log("Room", room);
		console.log("--------- ================ ---------");
	}

	return (
		<>
			<button onClick={printStatus}>Printar info</button>
			<button
				onClick={() => {
					buyCards(2);
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
