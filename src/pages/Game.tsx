import React, { useEffect, useState } from "react";

import { CardComponent } from "../components/CardComponent";
import { useGame } from "../hooks/useGame";

export function Game() {
	const { currentUser, room, players, deck } = useGame();

	function startGame() {
		if (players.players.length === 2) {
			console.log("podemos começar");
		} else {
			console.log("nao tem total de players ainda");
		}
	}

	function changeTurn() {
		switch (room.room && room.room.turn) {
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
			{room.room && room.room.playersCounter < 2 && (
				<div>
					<h4>Aguardando segundo jogador...</h4>
				</div>
			)}
			<div>
				<h1>Aqui vai mostrar os cards</h1>
				{/* <button onClick={changeTurn}>muda turno</button> */}
				<CardComponent
					currentCard={currentUser.currentUserDeck[0]}
				></CardComponent>
			</div>
		</>
	);
}
