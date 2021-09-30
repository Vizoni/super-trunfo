import { useEffect, useState } from "react";
import { useGame } from "../hooks/useGame";
import { Card } from "../interfaces/Card";
import "./cardStyle.css";

export function CardComponent(props: any) {
	const { isCurrentUserTurn, cardMatch, room, isWaitingSecondPlayer } =
		useGame();

	const [doFlipAnimation, setDoFlipAnimation] = useState(false);

	function compareAttribute(cardIndexInCurrentUserDeck: any) {
		if (!isCurrentUserTurn() || isWaitingSecondPlayer()) {
			return;
		}
		cardMatch(cardIndexInCurrentUserDeck);
	}

	function isCurrentAttributeBeingCompared(currentCardAttributeName: string) {
		const attributeBeingCompared =
			room.room.cardsComparison.attributeBeingCompared;
		return attributeBeingCompared === currentCardAttributeName;
	}

	function highLightCardTypeAAgainstSuperTrunfo(card: Card) {
		return (
			room.room.cardsComparison.isComparingSuperTrunfoAgainstCardTypeA &&
			card.type == "A"
		);
	}

	function isCardWinner(card: Card) {
		return card.name === room.room.cardsComparison.winnerCardName;
	}

	useEffect(() => {
		setDoFlipAnimation(!props.display);
	}, [props.display]);

	return (
		<>
			<div
				className={`flip-container ${doFlipAnimation ? "do-flip" : ""} ${
					isCardWinner(props.currentCard) ? `winner-card` : ``
				}`}
				data-testId="card-component"
			>
				<div className="flipper">
					<div className="front">
						<div className={`card`}>
							<div className="header">
								<h2 className="car-name">{props.currentCard.name}</h2>
								{props.currentCard.isSuperTrunfo && (
									<h2 className="super-trunfo" data-testId="super-trunfo-label">
										{props.currentCard.isSuperTrunfo ? "SUPER TRUNFO" : ""}
									</h2>
								)}
								<h2
									className={`type ${
										highLightCardTypeAAgainstSuperTrunfo(props.currentCard)
											? `high-light-type animation-blink`
											: ""
									}`}
									data-testId="high-light-a-type"
								>
									{props.currentCard.type}
								</h2>
							</div>
							<div className="image-box">
								<img className="card-image" src={props.currentCard.image}></img>
							</div>
							<div
								className={`attribute-list ${
									room.room.cardsComparison
										.isComparingSuperTrunfoAgainstCardTypeA
										? `blur`
										: ""
								}`}
								data-testId="attr-list"
							>
								{props.currentCard.attributes.map(
									(attribute: any, index: any) => {
										return (
											<div
												key={index}
												onClick={() => compareAttribute(index)}
												className={`attribute-item ${
													isCurrentUserTurn() && !isWaitingSecondPlayer()
														? `clickable`
														: ``
												}
									${
										(room.room.cardsComparison.isComparingCards &&
											!isCurrentAttributeBeingCompared(attribute.name)) ||
										room.room.cardsComparison
											.isComparingSuperTrunfoAgainstCardTypeA
											? `opacity`
											: ``
									}${
													room.room.cardsComparison.isComparingCards &&
													isCurrentAttributeBeingCompared(attribute.name) &&
													!room.room.cardsComparison
														.isComparingSuperTrunfoAgainstCardTypeA
														? `high-light-attribute animation-blink`
														: ``
												}`}
												data-testId="attr-row"
											>
												<div>
													<h2>{attribute.name}</h2>
												</div>
												<div
													className={
														(room.room.cardsComparison.isComparingCards &&
															!isCurrentAttributeBeingCompared(
																attribute.name
															)) ||
														room.room.cardsComparison
															.isComparingSuperTrunfoAgainstCardTypeA
															? `blur`
															: ``
													}
												>
													<h2>{attribute.value}</h2>
												</div>
											</div>
										);
									}
								)}
							</div>
						</div>
					</div>
					<div className="back">
						<div className="card hide-all">
							<span className="hided-card-logo">Super Trunfo</span>
							<span className="deck-theme-name">Cachorros</span>
							<span className="hided-card-h4">{` < Carta do Oponente > `}</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
