import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";

import { Card } from "../interfaces/Card";

export function CardComponent(currentCard: Card) {
	// const [currentCard, setCurrentCard] = useState<Card>({
	// 	name: "Fiat Uno",
	// 	type: "D",
	// 	isSuperTrunfo: false,
	// 	attributes: [
	// 		{
	// 			name: "Potência",
	// 			value: "50",
	// 		},
	// 	],
	// });

	useEffect(() => {
		console.log("CARD COMPONENT -> ", currentCard);
	}, [currentCard]);

	const createCardAttributesListHTML = () => {
		// return currentCard.attributes.map((attribute, index) => {
		// 	<h3>{index}</h3>;
		// 	console.log("MAP card component", attribute, index);
		// 	console.log("MAP card component22", attribute.name);
		// 	<div style={{ border: "red 3px solid" }}>
		// 		<h2>{attribute.name}</h2>
		// 		<h2>{attribute.value}</h2>
		// 	</div>;
		// });
	};

	return (
		<>
			<div>
				<div style={{ border: "#9c27b0 3px solid" }}>
					<h2>{currentCard.name}</h2>
					<h2>{currentCard.type}</h2>
					{/* <h2>{currentCard.isSuperTrunfo}</h2> */}
					{createCardAttributesListHTML()}
				</div>
			</div>
		</>
	);
}
