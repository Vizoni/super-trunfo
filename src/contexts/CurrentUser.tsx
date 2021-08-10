import React, { ReactNode, useEffect, useState } from "react";
import { Card } from "../interfaces/Card";
import { Player } from "../interfaces/Player";
import { database } from "../services/firebase";

type CurrentUserContextType = {
	currentUser: Player | undefined;
	setCurrentUser: (data: Player) => void;
	addCardsToDeck: (roomId: string | undefined, newCards: Card[]) => void;
};

type CurrentUserContextProviderProps = {
	children: ReactNode;
};

export const CurrentUserContext = React.createContext(
	{} as CurrentUserContextType
);

export function CurrentUserContextProvider({
	children,
}: CurrentUserContextProviderProps) {
	const [currentUser, setCurrentUser] = useState<Player | undefined>();
	// const [currentUserDeck, setCurrentUserDeck] = useState<Card[]>([]);

	useEffect(() => {
		console.log("CURRENTUSER - Context:", currentUser);
	}, [currentUser]);

	async function addCardsToDeck(roomId: string | undefined, newCards: Card[]) {
		console.log(
			"currentuser context - new cards",
			roomId,
			newCards,
			currentUser
		);
		await database
			.ref(`rooms/${roomId}/players/${currentUser?.id}`)
			.update({ deck: newCards });
		// setCurrentUser(...currentUser?.deck, { deck: newCards });
	}

	return (
		<CurrentUserContext.Provider
			value={{ currentUser, setCurrentUser, addCardsToDeck }}
		>
			{children}
		</CurrentUserContext.Provider>
	);
}
