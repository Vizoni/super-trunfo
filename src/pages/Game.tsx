import { CardComponent } from "../components/CardComponent";
import { HUDComponent } from "../components/HUDComponent";
import { useGame } from "../hooks/useGame";

export function Game() {
	const { currentUser, room, players } = useGame();

	return (
		<>
			{room.room && room.room.playersCounter < 2 && (
				<div>
					<h4>Aguardando segundo jogador...</h4>
				</div>
			)}
			{room.room.winnerPlayerId &&
				room.room.winnerPlayerId == currentUser.currentUser.id && (
					<h2>Você Ganhou!</h2>
				)}
			{room.room.winnerPlayerId &&
				room.room.winnerPlayerId != currentUser.currentUser.id && (
					<h2>Você Perdeu!</h2>
				)}
			{!room.room.winnerPlayerId && (
				<div>
					<HUDComponent />
					{/* <CardComponent
						currentCard={currentUser.currentUserDeck[0]}
					></CardComponent> */}
					<div className="cards-comparison">
						{players.players.map((player, index) => {
							if (player.deck) {
								return (
									<CardComponent
										key={index}
										currentCard={player.deck[0]}
										isCurrentUserCard={player.id == currentUser.currentUser.id}
									></CardComponent>
								);
							}
						})}
					</div>
				</div>
			)}
		</>
	);
}
