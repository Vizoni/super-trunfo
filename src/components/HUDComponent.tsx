import { useEffect, useState } from "react";
import { useGame } from "../hooks/useGame";
import "./hudStyle.css";

export function HUDComponent() {
	const { isCurrentUserTurn, isWaitingSecondPlayer } = useGame();

	return (
		<>
			<header>
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
			</header>
		</>
	);
}
