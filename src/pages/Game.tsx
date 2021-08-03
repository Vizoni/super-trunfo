import React, { useEffect, useState } from "react";

import { database, firebase } from "../services/firebase";
import { useHistory, useLocation } from "react-router-dom";
import { Card } from "../interfaces/Card";
import { Player } from "../interfaces/Player";
import { shuffle } from "../utils/shuffle";
import { PACK_OF_CARDS } from "../services/packOfCards";
import { useRoom } from "../hooks/useRoom";
import { usePlayers } from "../hooks/usePlayers";

export function Game() {
	const [users, setUsers] = useState<Player[]>([]);
	const [currentUser, setCurrentUser] = useState("");

	const [player1Deck, setPlayer1Deck] = useState<Card[]>([]);
	const [player2Deck, setPlayer2Deck] = useState<Card[]>([]);
	const [turn, setTurn] = useState("Player 1");
	// const { room, players, setRoom, createRoom, updatePlayerDeck } = useRoom();
	const { room, setRoom, createRoom, updatePlayerDeck } = useRoom();
	const { players } = usePlayers();

	function startGame() {
		console.log("GAME - PLAYERS", players);
		// if (players?.length < 2) {
		// 	return;
		// } else {
		const shuffledCards = shuffle(PACK_OF_CARDS);
		const halfOfDeckAmount = Math.trunc(shuffledCards.length / 2);
		// depois de embaralhar, o primeiro player pega a primeira metade do monte
		// e o segundo player pega o restante do monte -> Devem ter a mesma qtd de cartas!
		setupBothPlayersDeck();
		// }
		// setPlayer1Deck(shuffledCards.slice(0, halfOfDeckAmount));
		// setPlayer2Deck(
		// 	shuffledCards.slice(halfOfDeckAmount, Math.trunc(shuffledCards.length))
		// );
	}

	function setupBothPlayersDeck() {
		players.forEach((player) => {
			console.log("setup -", player);
		});
	}

	function changeTurn() {
		switch (room ? room.turn : undefined) {
			// case "Player 1":
			// 	database.ref(`rooms/${room?.id}`).update({ turn: "Player 2" });
			// 	break;
			// case "Player 2":
			// 	database.ref(`rooms/${room?.id}`).update({ turn: "Player 1" });
			// 	break;
			default:
				break;
		}
	}

	useEffect(() => {
		startGame();
		console.log("comp game -> players", players);
		// setUsers(players);
		// setUsers(playersList)
	}, []);

	// pra mostrar os cards tem q fazer um condicional falando: se for o player 1 -> os cards sao o do deck 1
	// se for player 2, os cards sao do deck 2;
	// tbm tem q ter a condicional: vc só pode mexer e ver as cartas do seu current user

	return (
		<>
			{room
				? room.playersCounter < 2 && (
						<div>
							<h4>Aguardando segundo jogador...</h4>
						</div>
				  )
				: ""}
			<div>
				<h1>Aqui vai mostrar os cards</h1>
				<button onClick={changeTurn}>muda turno</button>
			</div>
		</>
	);
}
