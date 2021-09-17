import { useGame } from "../hooks/useGame";
import "./hudStyle.css";

export function HUDComponent() {
	const { currentUser, isCurrentUserTurn, isWaitingSecondPlayer } = useGame();

	return (
		<>
			<div className="hud-container">
				<span>Você tem {currentUser.currentUserDeck.length} cartas</span>
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
				<div>
					{isWaitingSecondPlayer() && (
						<div className="waiting-second-player">
							{/* <div className="waiting-second-player"> */}
							<span className="waiting-player-label blink-animate">
								Aguardando segundo jogador
							</span>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
