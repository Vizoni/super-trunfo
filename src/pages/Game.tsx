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

	useEffect(() => {
		startGame();
	}, [players]);

	return (
		<>
			{room.room && room.room.playersCounter < 2 && (
				<div>
					<h4>Aguardando segundo jogador...</h4>
				</div>
			)}
			<div>
				{/* <button onClick={changeTurn}>muda turno</button> */}
				<HUDComponent />
				<CardComponent
					currentCard={currentUser.currentUserDeck[0]}
				></CardComponent>
			</div>
		</>
	);
}
