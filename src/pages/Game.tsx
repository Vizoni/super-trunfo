import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";

import { database, firebase } from "../services/firebase";
import { useHistory, useLocation } from "react-router-dom";
import { Card } from "../interfaces/Card";
import { Player } from "../interfaces/Player";
import { shuffle } from "../utils/shuffle";
import { PACK_OF_CARDS } from "../services/packOfCards";
import { useRoom } from "../hooks/useRoom";
import { usePlayers } from "../hooks/usePlayers";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useGameDeck } from "../hooks/useGameDeck";

export function Game() {
	const { currentUser, setCurrentUser, addCardsToDeck } = useCurrentUser();
	const { room, setRoom, createRoom, updatePlayerDeck } = useRoom();
	const { players, setPlayersDeck } = usePlayers();
	const { deck, playerDrawCards } = useGameDeck();

	function startGame() {
		if (players?.length === 2) {
			console.log("podemos começar");
			console.log("game -> currentuser", currentUser);
		} else {
			console.log("nao tem total de players ainda");
		}
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
	}, [players]);

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
