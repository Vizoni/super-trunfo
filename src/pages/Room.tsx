import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useGame } from "../hooks/useGame";
import { Game } from "./Game";

export function Room() {
	const { currentUser, buyCardsForGameStart, userLeaveGame } = useGame();

	const history = useHistory();

	useEffect(() => {
		if (!currentUser.currentUser.id) {
			history.push({
				pathname: `/`,
			});
		}
		buyCardsForGameStart();
		return () => {
			userLeaveGame();
		};
	}, []);

	window.addEventListener("beforeunload", function (e) {
		e.preventDefault();
		e.returnValue = "";
		userLeaveGame();
	});

	return (
		<>
			<Game></Game>
		</>
	);
}
