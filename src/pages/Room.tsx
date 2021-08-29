import { useEffect } from "react";
import { useGame } from "../hooks/useGame";
import { Game } from "./Game";

export function Room() {
	const { buyCardsForGameStart } = useGame();

	useEffect(() => {
		console.log("--------- ENTROU NA SALA ---------");
		console.log("Usuário vai comprar 2 cards");
		buyCardsForGameStart();
	}, []);

	return (
		<>
			{/* <button
				onClick={() => {
					buyCards(1);
				}}
			>
				Comprar cards
			</button> */}
			<Game></Game>
		</>
	);
}
