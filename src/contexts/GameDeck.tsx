import React, { ReactNode, useEffect, useState } from "react";
import { Card } from "../interfaces/Card";
import { PACK_OF_CARDS } from "../services/packOfCards";
import { shuffle } from "../utils/shuffle";

type GameDeckContextType = {
	deck: Card[];
	setDeck: (data: Card[]) => void;
	generateNewGameDeck: () => void;
	playerBuyCard: (amountOfCards: number) => Card[];
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

	// useEffect(() => {
	// 	console.log("SETANDO DECK EMBARALHADO NO USE EFFECT");
	// 	setDeck(shuffle(PACK_OF_CARDS));
	// }, []);

	function generateNewGameDeck() {
		console.log("SETANDO DECK EMBARALHADO NO generateNewGameDeck");
		setDeck(shuffle(PACK_OF_CARDS));
	}

	function playerBuyCard(amountOfCards: number): Card[] {
		if (deck.length <= 0) return [];
		let auxDeck: Card[] = [];
		auxDeck = deck.slice(0, deck.length);
		console.log("UAX", auxDeck);
		console.log("deck", deck);
		const cardsPlayerWillReceive = [];
		console.log("DECK ANTES DE COMEÇAR", deck);
		for (let index = 0; index < amountOfCards; index++) {
			const card = deck[index];
			cardsPlayerWillReceive.push(card);
			// ja retira o card comprado da array cópia e atualiza os cards do deck
			auxDeck.splice(index, 1);
			setDeck(auxDeck);
		}
		console.log("CARDS RECEBIDOS", cardsPlayerWillReceive);
		return cardsPlayerWillReceive as Card[];
	}

	return (
		<GameDeckContext.Provider
			value={{ deck, setDeck, generateNewGameDeck, playerBuyCard }}
		>
			{children}
		</GameDeckContext.Provider>
	);
}
