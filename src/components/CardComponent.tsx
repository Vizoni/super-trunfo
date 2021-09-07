import { useEffect } from "react";
import { useGame } from "../hooks/useGame";
import "./cardStyle.scss";

export function CardComponent(props: any) {
	const { isCurrentUserTurn, cardMatch, room } = useGame();

	useEffect(() => {
		console.log("card component comparison", room.room.cardsComparison);
	}, [room.room.cardsComparison]);

	function handleClick(cardIndexInCurrentUserDeck: any) {
		if (!isCurrentUserTurn()) {
			return;
		}
		cardMatch(cardIndexInCurrentUserDeck);
	}

	function displaySuperTrunfoBadgeLabel(isSuperTrunfo: boolean) {
		if (isSuperTrunfo) {
			return "SUPER-TRUNFO";
		}
	}

	function isCurrentAttributeBeingCompared(attributeName: string) {
		console.log(
			"comparando",
			room.room.cardsComparison.attributeBeingCompared,
			attributeName
		);
		if (room.room.cardsComparison.attributeBeingCompared == attributeName) {
			console.log("É TRUE");
			return true;
		}
		return false;
	}

	useEffect(() => {
		const card = document.getElementById("card");
		if (card?.classList.contains("card--flipped")) {
			card.classList.add("card--unflip");
			setTimeout(function () {
				card.classList.remove("card--flipped", "card--unflip");
			}, 500);
		} else {
			card?.classList.add("card--flipped");
		}
	}, [props.display]);

	function click() {
		const card = document.getElementById("card");
		if (card?.classList.contains("card--flipped")) {
			card.classList.add("card--unflip");
			setTimeout(function () {
				card.classList.remove("card--flipped", "card--unflip");
			}, 500);
		} else {
			card?.classList.add("card--flipped");
		}
	}

	return (
		<>
			<div className="card-scene">
				<div id="card" className="card">
					{!props.display && (
						<div className="card-face card-backing">
							<div className="grain-overlay"></div>
							<div className="bump"></div>
							<div className="top-banner"></div>
							<div className="back-main">
								<div className="pipboy">
									<div className="twelve-point-star"></div>
									<img src="https://vignette.wikia.nocookie.net/fallout/images/c/c0/VaultBoyFO3.png/revision/latest?cb=20110809182235" />
								</div>
								<div className="vault-tec">
									<div className="center"></div>
									<div className="lines">
										<div className="line line--left">
											<div className="line-inner"></div>
											<div className="line-inner"></div>
											<div className="line-inner"></div>
										</div>
										<div className="line line--right">
											<div className="line-inner"></div>
											<div className="line-inner"></div>
											<div className="line-inner"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
					{props.display && (
						<div className="card-face card-front">
							<h1>
								<span className="bump">
									<b className="outer">
										<b className="inner">1</b>
									</b>
								</span>
								Slugger
							</h1>
							<div className="main-pane">
								<img
									className="slugger"
									src="https://vignette.wikia.nocookie.net/fallout/images/6/69/Fo76_Slugger.png/revision/latest/scale-to-width-down/353?cb=20181125171021"
								/>
							</div>
							<div className="desc">
								<p>Your two-handed melee weapons now do +10% damage.</p>
								<div className="special" data-category="strength">
									S
								</div>
								<div
									id="level"
									className="level"
									// data-level-cap="3"
									// data-level-current="1"
								>
									5
								</div>
							</div>
							<div className="grain-overlay"></div>
						</div>
					)}
				</div>
			</div>
			{/* {props.display && (
				<div className="card">
					<div className="header">
						<h2 className="car-name">{props.currentCard.name}</h2>
						{props.currentCard.isSuperTrunfo && (
							<h2 className="super-trunfo">
								{displaySuperTrunfoBadgeLabel(props.currentCard.isSuperTrunfo)}
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
										!isCurrentAttributeBeingCompared(attribute.name)
											? `opacity`
											: ``
									}`}
								>
									<div>
										<h2>{attribute.name}</h2>
									</div>
									<div
										className={
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
		</> */}
		</>
	);
}
