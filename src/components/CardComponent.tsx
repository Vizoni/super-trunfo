import { useGame } from "../hooks/useGame";

export function CardComponent(currentCard: any) {
	const { isCurrentUserTurn, compareCards } = useGame();

	function handleClick(cardIndexInCurrentUserDeck: any) {
		console.log("hand click", cardIndexInCurrentUserDeck);
		if (!isCurrentUserTurn()) {
			return;
		}
		compareCards(cardIndexInCurrentUserDeck);
	}

	return (
		<>
			{currentCard && currentCard.currentCard && (
				<div>
					<div style={{ border: "#9c27b0 3px solid" }}>
						<h2>{currentCard.currentCard.name}</h2>
						<h2>{currentCard.currentCard.type}</h2>
						<h2>{currentCard.isSuperTrunfo}</h2>
						<div>
							{currentCard.currentCard.attributes.map(
								(attribute: any, index: any) => {
									return (
										<div
											onClick={() => handleClick(index)}
											style={{ border: "#000 3px solid" }}
										>
											<div>
												<h2>{attribute.name}</h2>
											</div>
											<div>
												<h2>{attribute.value}</h2>
											</div>
										</div>
									);
								}
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
