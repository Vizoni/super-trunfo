import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CardComponent } from "../components/CardComponent";
import { HUDComponent } from "../components/HUDComponent";
import { ModalComponent } from "../components/ModalComponent";
import { useGame } from "../hooks/useGame";
import "./../style.css";

export function Game() {
	const { currentUser, room, players, isWaitingSecondPlayer } = useGame();
	const history = useHistory();

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

	function gameIsOverAndHasAWinner() {
		return room.room.winnerPlayerId ? true : false;
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
			<div>
				<HUDComponent />

				<div
					className={`flex-container ${
						isWaitingSecondPlayer() ? `waiting-player` : ``
					}`}
				>
					{gameIsOverAndHasAWinner() && (
						<div>
							{isCurrentPlayerTheWinner() && (
								<ModalComponent
									display={true}
									userWon={isCurrentPlayerTheWinner()}
									title="VITÓRIA!"
									subTitle="Parabéns, você venceu o duelo!"
									text="Volte para o Lobby para encontrar um novo oponente!"
									btnLabel="Voltar para o Lobby"
									closeFunction={redirectUserToHome}
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
			</div>
		</>
	);
}
