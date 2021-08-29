import { useEffect, useState } from "react";
import { useGame } from "../hooks/useGame";
import "./cardStyle.css";

export function CardComponent(props: any) {
	const { isCurrentUserTurn, cardMatch } = useGame();

	function handleClick(cardIndexInCurrentUserDeck: any) {
		if (!isCurrentUserTurn()) {
			return;
		}
		cardMatch(cardIndexInCurrentUserDeck);
	}

	return (
		<>
			{props && props.currentCard && props.isCurrentUserCard && (
				<div>
					<div className={`card`}>
						<h2>{props.currentCard.name}</h2>
						<h2>{props.currentCard.type}</h2>
						<h2>{props.isSuperTrunfo}</h2>
						<div>
							{props.currentCard.attributes.map(
								(attribute: any, index: any) => {
									return (
										<div
											onClick={() => handleClick(index)}
											className="card-attribute-item"
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
			{props && props.currentCard && !props.isCurrentUserCard && (
				<div className={`card hide-all`}>
					<h2>CARD DO OPONENTE (NAO VAI MOSTRAR OS DETALHES)</h2>
				</div>
			)}
		</>
	);
}
