import { useEffect } from "react";

import { CardComponent } from "../components/CardComponent";
import { HUDComponent } from "../components/HUDComponent";
import { useGame } from "../hooks/useGame";

export function Game() {
	const { currentUser, room, players } = useGame();

	function startGame() {
		if (players.players.length === 2) {
			console.log("podemos começar");
		} else {
			console.log("nao tem total de players ainda");
		}
	}

	// useEffect(() => {
	// 	startGame();
	// }, [players]);

	// useEffect(() => {
	// 	console.log("Mudou o room", room.room);
	// }, [room]);

	return (
		<>
			{room.room && room.room.playersCounter < 2 && (
				<div>
					<h4>Aguardando segundo jogador...</h4>
				</div>
			)}
			{/* {playerLoser.id && playerLoser.id == currentUser.currentUser.id && (
				<h2>Você Perdeu!</h2>
			)}
			{playerLoser.id && playerLoser.id != currentUser.currentUser.id && (
				<h2>Você Ganhou!</h2>
			)}
			{!playerLoser.id && ( */}
			<div>
				{/* <button onClick={changeTurn}>muda turno</button> */}
				<HUDComponent />
				<CardComponent
					currentCard={currentUser.currentUserDeck[0]}
				></CardComponent>
			</div>
			{/* )} */}
		</>
	);
}
