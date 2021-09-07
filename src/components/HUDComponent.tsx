import { useGame } from "../hooks/useGame";

export function HUDComponent() {
	const { currentUser, isCurrentUserTurn, room } = useGame();

	return (
		<>
			<div>
				{isCurrentUserTurn() ? (
					<h2>SUA VEZ!!</h2>
				) : (
					<h2>É a vez do seu oponente. Aguarde.</h2>
				)}
				<h2>Cards no seu baralho: {currentUser.currentUserDeck.length}</h2>

				{room.room.cardsComparison.attributeBeingCompared && (
					<h2>
						Comparando: {room.room.cardsComparison.attributeBeingCompared}
					</h2>
				)}
			</div>
		</>
	);
}
