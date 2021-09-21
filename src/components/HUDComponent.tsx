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
	} = useGame();

	return (
		<>
			<header>
				<div>
					{!currentUserIsSecondPlayer() &&
						players.players[0] &&
						playerIsCurrentUser(players.players[0]) && (
							<span className="deck-amount">
								{currentUser.currentUserDeck.length} cartas
							</span>
						)}
				</div>
				{!isWaitingSecondPlayer() && (
					<div className="waiting-second-player">
						{isCurrentUserTurn() ? (
							<span className="waiting-player-label blink-animate">
								É A SUA VEZ DE JOGAR!
							</span>
						) : (
							<span className="waiting-player-label">
								É a vez do seu oponente. Aguarde.
							</span>
						)}
					</div>
				)}
				{isWaitingSecondPlayer() && (
					<div className="waiting-second-player">
						<span className="waiting-player-label blink-animate">
							Aguardando segundo jogador
						</span>
					</div>
				)}
				<div>
					{currentUserIsSecondPlayer() &&
						players.players[1] &&
						playerIsCurrentUser(players.players[1]) && (
							<span className="deck-amount">
								{currentUser.currentUserDeck.length} cartas
							</span>
						)}
				</div>
			</header>
		</>
	);
}
