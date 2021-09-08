import { CardComponent } from "../components/CardComponent";
import { HUDComponent } from "../components/HUDComponent";
import { useGame } from "../hooks/useGame";
import { Card } from "../interfaces/Card";
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

	function isCardWinner(card: Card) {
		if (card.name == room.room.cardsComparison.winnerCardName) {
			return true;
		}
		return false;
	}

	return (
		<>
			{room.room && room.room.playersCounter < 2 && (
				<div>
					<h4>Aguardando segundo jogador...</h4>
				</div>
			)}
			{/* {room.room.winnerPlayerId &&
				room.room.winnerPlayerId == currentUser.currentUser.id && (
					<h2>Você Ganhou!</h2>
				)}
			{room.room.winnerPlayerId &&
				room.room.winnerPlayerId != currentUser.currentUser.id && (
					<h2>Você Perdeu!</h2>
				)} */}
			{!room.room.winnerPlayerId && (
				<div>
					<HUDComponent />
					{/* <div className="cards-comparison"> */}
					{/* {players.players.map((player, index) => {
							if (player.deck) {
								return (
									<div className="player-side">
										{isCardWinner(player.deck[0]) && (
											<div className="winner-card-label">Vencedor</div>
										)}
										<CardComponent
											key={index}
											currentCard={player.deck[0]}
											display={canDisplayCard(player)}
										></CardComponent>
									</div>
								);
							}
						})} */}
					<div className="flex-container">
						{players.players.map((player, index) => {
							if (player.deck) {
								return (
									// <div className="player-side">
									<>
										{isCardWinner(player.deck[0]) && (
											<div className="winner-card-label">Vencedor</div>
										)}
										<CardComponent
											key={index}
											currentCard={player.deck[0]}
											display={canDisplayCard(player)}
										></CardComponent>
										{/* // </div> */}
									</>
								);
							}
						})}
						{/* <div className="column">
							Column 1<h2> teste </h2>
							<h2> teste </h2>
							<h2> teste </h2>
							<h2> teste </h2>
							<h2> teste </h2>
							<h2> teste </h2>
							<h2> teste </h2>
						</div>
						<div className="column bg-alt">Column 2</div> */}
					</div>
					{/* </div> */}
				</div>
			)}
		</>
	);
}
