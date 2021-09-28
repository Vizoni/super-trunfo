import { useEffect, useState } from "react";
import { useGame } from "../hooks/useGame";
import "./hudStyle.css";

export function HUDComponent() {
	const {
		players,
		currentUser,
		isCurrentUserTurn,
		isWaitingSecondPlayer,
		currentUserIsSecondPlayer,
		playerIsCurrentUser,
		isGameOver,
	} = useGame();

	return (
		<>
			<header data-testId="hud-header">
				<div>
					{!currentUserIsSecondPlayer() &&
						players.players[0] &&
						playerIsCurrentUser(players.players[0]) && (
							<span
								className="deck-amount"
								data-testId="hud-deck-amount-first-player"
							>
								{currentUser.currentUserDeck.length} cartas
							</span>
						)}
				</div>
				{!isWaitingSecondPlayer() && !isGameOver() && (
					<div className="waiting-second-player">
						{isCurrentUserTurn() ? (
							<span
								className="waiting-player-label blink-animate"
								data-testId="my-turn"
							>
								É A SUA VEZ DE JOGAR!
							</span>
						) : (
							<span
								className="waiting-player-label"
								data-testId="opponent-turn"
							>
								É a vez do seu oponente. Aguarde.
							</span>
						)}
					</div>
				)}
				{isWaitingSecondPlayer() && (
					<div
						className="waiting-second-player"
						data-testId="waiting-second-player"
					>
						<span className="waiting-player-label blink-animate">
							Aguardando segundo jogador
						</span>
					</div>
				)}
				<div>
					{currentUserIsSecondPlayer() &&
						players.players[1] &&
						playerIsCurrentUser(players.players[1]) && (
							<span
								className="deck-amount"
								data-testId="hud-deck-amount-second-player"
							>
								{currentUser.currentUserDeck.length} cartas
							</span>
						)}
				</div>
			</header>
		</>
	);
}
