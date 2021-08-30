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

	function shouldDisplay() {
		if (props && props.currentCard) {
		}
	}

	function displaySuperTrunfoBadge(isSuperTrunfo: boolean) {
		if (isSuperTrunfo) {
			return "SUPER-TRUNFO";
		}
	}

	return (
		<>
			{props && props.currentCard && props.isCurrentUserCard && (
				<div className="card">
					<div className="header">
						<h2 className="car-name">{props.currentCard.name}</h2>
						{props.currentCard.isSuperTrunfo && (
							<h2 className="super-trunfo">
								{displaySuperTrunfoBadge(props.currentCard.isSuperTrunfo)}
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
						})}
					</div>
				</div>
			)}
			{props && props.currentCard && !props.isCurrentUserCard && (
				<div className="card hide-all">
					<div>
						<h1 className="hided-card-logo">Super Trunfo</h1>
						<h2>Carros</h2>
					</div>
					<h4 className="hided-card-h4">{` < Carta do Oponente > `}</h4>
				</div>
			)}
		</>
	);
}
