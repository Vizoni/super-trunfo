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
					<div className="card">
						<div className="header">
							<h2>{props.currentCard.name}</h2>
							<h2>{props.currentCard.isSuperTrunfo}</h2>
							<h2 className="type">{props.currentCard.type}</h2>
						</div>
						<img src={props.currentCard.image}></img>
						<div className="attribute-list">
							{props.currentCard.attributes.map(
								(attribute: any, index: any) => {
									return (
										<div
											onClick={() => handleClick(index)}
											className="attribute-item"
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
