import { useEffect } from "react";
import { useGame } from "../hooks/useGame";
import { Game } from "./Game";

export function Room() {
	const { buyCardsForGameStart, userLeaveGame } = useGame();

	useEffect(() => {
		console.log("--------- ENTROU NA SALA ---------");
		console.log("Usuário vai comprar 2 cards");
		buyCardsForGameStart();
		return () => {
			userLeaveGame();
		};
	}, []);

	window.onbeforeunload = (event) => {
		userLeaveGame();
	};

	return (
		<>
			<Game></Game>
		</>
	);
}
