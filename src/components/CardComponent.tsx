import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";

import { Card } from "../interfaces/Card";

export function CardComponent(currentCard: any) {
	return (
		<>
			{currentCard && currentCard.currentCard && (
				<div>
					<div style={{ border: "#9c27b0 3px solid" }}>
						<h2>{currentCard.currentCard.name}</h2>
						<h2>{currentCard.currentCard.type}</h2>
						<h2>{currentCard.isSuperTrunfo}</h2>
						<div>
							{currentCard.currentCard.attributes.map((attribute: any) => {
								return (
									<div style={{ border: "#000 3px solid" }}>
										<h2>{attribute.name}</h2>
										<h2>{attribute.value}</h2>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
