import { useHistory } from "react-router-dom";
import { CardComponent } from "../components/CardComponent";
import { HUDComponent } from "../components/HUDComponent";
import { ModalComponent } from "../components/ModalComponent";
import { useGame } from "../hooks/useGame";
import "./../style.css";

export function Game() {
	const {
		currentUser,
		room,
		players,
		isWaitingSecondPlayer,
		playerIsCurrentUser,
		isGameOver,
	} = useGame();

	const history = useHistory();

	function canDisplayCard(player: any) {
		if (playerHasAtLeastOneCardOnDeck(player)) {
			if (playerIsCurrentUser(player)) {
				return true;
			}
			if (
				!playerIsCurrentUser(player) &&
				room.room.cardsComparison.isComparingCards
			) {
				return true;
			}
		}
		return false;
	}

	function playerHasAtLeastOneCardOnDeck(player: any) {
		return player.deck.length > 0 ? true : false;
	}

	function isCurrentPlayerTheWinner() {
		return room.room.winnerPlayerId == currentUser.currentUser.id;
	}

	function redirectUserToHome() {
		history.push({
			pathname: `/`,
		});
		window.location.reload(); // to reset the hooks
	}

	return (
		<>
			<HUDComponent />

			<div
				className={isWaitingSecondPlayer() ? `waiting-player` : ``}
				data-testId="is-waiting-player"
			>
				{isGameOver() && (
					<div data-testId="game-over">
						{isCurrentPlayerTheWinner() && (
							<ModalComponent
								display={true}
								userWon={isCurrentPlayerTheWinner()}
								title="VITÓRIA!"
								subTitle="Parabéns, você venceu o duelo!"
								text="Volte para o Lobby para encontrar um novo oponente!"
								btnLabel="Voltar para o Lobby"
								closeFunction={redirectUserToHome}
								data-testId="victory-modal"
							></ModalComponent>
						)}
						{!isCurrentPlayerTheWinner() && (
							<ModalComponent
								display={true}
								userWon={isCurrentPlayerTheWinner()}
								title="DERROTA!"
								subTitle="Que pena, não foi dessa vez!"
								text="Volte para o Lobby para encontrar um novo oponente!"
								btnLabel="Voltar para o Lobby"
								closeFunction={redirectUserToHome}
							></ModalComponent>
						)}
					</div>
				)}
			</div>
			<div className="container" data-testId="game-container">
				{players.players.map((player, index) => {
					if (player.deck) {
						return (
							<>
								<CardComponent
									key={index}
									currentCard={player.deck[0]}
									display={canDisplayCard(player)}
								></CardComponent>
							</>
						);
					}
				})}
			</div>
		</>
	);
}
