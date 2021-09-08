import { useGame } from "../hooks/useGame";
import "./cardStyle.css";

export function CardComponent(props: any) {
	const { isCurrentUserTurn, cardMatch, room } = useGame();

	function handleClick(cardIndexInCurrentUserDeck: any) {
		if (!isCurrentUserTurn()) {
			return;
		}
		cardMatch(cardIndexInCurrentUserDeck);
	}

	function isCurrentAttributeBeingCompared(attributeName: string) {
		if (room.room.cardsComparison.attributeBeingCompared == attributeName) {
			return true;
		}
		return false;
	}

	return (
		<>
			{props.display && (
				<div className="card">
					<div className="header">
						<h2 className="car-name">{props.currentCard.name}</h2>
						{props.currentCard.isSuperTrunfo && (
							<h2 className="super-trunfo">
								{props.currentCard.isSuperTrunfo ? "SUPER TRUNFO" : ""}
							</h2>
						)}
						<h2 className="type">{props.currentCard.type}</h2>
					</div>
					<img src={props.currentCard.image}></img>
					<div className="attribute-list">
						{props.currentCard.attributes.map((attribute: any, index: any) => {
							return (
								<div
									onClick={() => handleClick(index)}
									className={`attribute-item ${
										room.room.cardsComparison.isComparingCards &&
										!isCurrentAttributeBeingCompared(attribute.name)
											? `opacity`
											: ``
									}${
										room.room.cardsComparison.isComparingCards &&
										isCurrentAttributeBeingCompared(attribute.name)
											? `high-light-attribute`
											: ``
									}`}
								>
									<div>
										<h2>{attribute.name}</h2>
									</div>
									<div
										className={
											room.room.cardsComparison.isComparingCards &&
											!isCurrentAttributeBeingCompared(attribute.name)
												? `blur`
												: ``
										}
									>
										<h2>{attribute.value}</h2>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
			{!props.display && (
				<div className="card hide-all">
					<div>
						<h1 className="hided-card-logo">Super Trunfo</h1>
						<h2 className="deck-theme-name">Carros</h2>
					</div>
					<h4 className="hided-card-h4">{` < Carta do Oponente > `}</h4>
				</div>
			)}
		</>
	);
}
