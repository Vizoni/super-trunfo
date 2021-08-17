import React, { ReactNode, useEffect, useState } from "react";
import { Card } from "../interfaces/Card";
import { database } from "../services/firebase";
import { PACK_OF_CARDS } from "../services/packOfCards";
import { shuffle } from "../utils/shuffle";

type GameDeckContextType = {
	deck: Card[];
	setDeck: (data: Card[]) => void;
	generateNewGameDeck: () => Card[];
	playerDrawCards: (roomId: any, amountOfCards: number) => Card[];
	listenToDeckUpdate: (roomId: any) => void;
};

type GameDeckContextProviderProps = {
	children: ReactNode;
};

export const GameDeckContext = React.createContext({} as GameDeckContextType);

export function GameDeckContextProvider({
	children,
}: GameDeckContextProviderProps) {
	const [deck, setDeck] = useState<Card[]>([]);

	useEffect(() => {
		console.log("DECK - Context:", deck);
	}, [deck]);

	function generateNewGameDeck() {
		const cardsShuffled = shuffle(PACK_OF_CARDS);
		setDeck(cardsShuffled);
		return cardsShuffled;
	}

	async function listenToDeckUpdate(roomId: any) {
		await database.ref(`rooms/${roomId}/deck`).on("value", (deck) => {
			if (deck.exists()) {
				setDeck(deck.val());
			}
		});
	}

	function updateGameDeckFromDatabase(roomId: any, cards: Card[]) {
		database.ref(`rooms/${roomId}/deck`).set(cards);
	}

	function playerDrawCards(roomId: any, amountOfCards: number): Card[] {
		if (deck.length <= 0) {
			console.log("Não existem cartas para serem compradas");
			return [];
		}

		let cardsToReceive: Card[] = [];
		cardsToReceive = deck.splice(0, amountOfCards);
		updateGameDeckFromDatabase(roomId, deck);
		return cardsToReceive;
	}

	return (
		<GameDeckContext.Provider
			value={{
				deck,
				setDeck,
				generateNewGameDeck,
				playerDrawCards,
				listenToDeckUpdate,
			}}
		>
			{children}
		</GameDeckContext.Provider>
	);
}
