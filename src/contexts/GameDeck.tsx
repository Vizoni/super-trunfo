import React, { ReactNode, useEffect, useState } from "react";
import { Card } from "../interfaces/Card";
import { database } from "../services/firebase";
import { PACK_OF_CARDS } from "../services/packOfCards";
import { shuffle } from "../utils/shuffle";

type GameDeckContextType = {
	deck: Card[];
	setDeck: (data: Card[]) => void;
	generateNewGameDeck: () => void;
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
		console.log("setando deck do generateNewGameDeck");
		setDeck(cardsShuffled);
		return cardsShuffled;
	}

	async function listenToDeckUpdate(roomId: any) {
		console.log("GameDeck -> listenToDeckUpdate", roomId);
		await database.ref(`rooms/${roomId}/deck`).on("value", (deck) => {
			if (deck.exists()) {
				console.log("UPDATE DECK ATUALIZANDO...");
				console.log("DEKC DO BANCO", roomId, deck.val());
				console.log("setando deck do listenToDeckUpdate");
				setDeck(deck.val());
			}
		});
	}

	function updateGameDeckFromDatabase(roomId: any, cards: Card[]) {
		database.ref(`rooms/${roomId}/deck`).set(cards);
	}

	function playerDrawCards(roomId: any, amountOfCards: number): Card[] {
		if (deck.length <= 0) {
			console.log("Não tem nada de carta pra comprar mano");
			return [];
		}

		let cardsToReceive: Card[] = [];
		cardsToReceive = deck.splice(0, amountOfCards);
		// setDeck(deck.splice(0, amountOfCards));
		// setDeck(deck);
		updateGameDeckFromDatabase(roomId, deck);
		console.log("cardsToReceive", cardsToReceive);
		return cardsToReceive;
		// console.log("UAX", auxDeck);
		// console.log("deck", deck);
		// const cardsPlayerWillReceive = [];
		// console.log("DECK ANTES DE COMEÇAR", deck);
		// for (let index = 0; index < amountOfCards; index++) {
		// 	const card = deck[index];
		// 	cardsPlayerWillReceive.push(card);
		// 	// ja retira o card comprado da array cópia e atualiza os cards do deck
		// 	auxDeck.splice(index, 1);
		// 	setDeck(auxDeck);
		// }
		// console.log("CARDS RECEBIDOS", cardsPlayerWillReceive);
		// return cardsPlayerWillReceive as Card[];
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
