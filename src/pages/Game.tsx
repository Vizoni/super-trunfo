import { CardComponent } from "../components/CardComponent";
import { HUDComponent } from "../components/HUDComponent";
import { useGame } from "../hooks/useGame";
import "./../style.css";

export function Game() {
	const { currentUser, room, players } = useGame();

	function canDisplayCard(player: any) {
		if (playerHasAtLeastOneCardOnDeck(player)) {
			if (isCurrentUserCard(player)) {
				return true;
			}
			if (
				!isCurrentUserCard(player) &&
				room.room.cardsComparison.isComparingCards
			) {
				return true;
			}
		}
		return false;
	}

	function isCurrentUserCard(player: any) {
		return player.id == currentUser.currentUser.id ? true : false;
	}
	function playerHasAtLeastOneCardOnDeck(player: any) {
		return player.deck.length > 0 ? true : false;
	}

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
					<div className="cards-comparison">
						{players.players.map((player, index) => {
							if (player.deck) {
								return (
									<CardComponent
										key={index}
										currentCard={player.deck[0]}
										display={canDisplayCard(player)}
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
