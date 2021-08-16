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

	useEffect(() => {
		console.log("CURRENTUSER - Context:", currentUser);
	}, [currentUser]);

	// check if there is already any card on current users deck
	// if already has cards then add the new Cards at the last position
	// if doesn't has cards yet, it add the draw cards to it first position
	async function addCardsToDeck(roomId: string | undefined, newCards: Card[]) {
		await database
			.ref(`rooms/${roomId}/players/${currentUser?.id}/deck`)
			.once("value", (currentDeck) => {
				if (currentDeck.exists()) {
					newCards = [...currentDeck.val(), ...newCards];
				}
				database
					.ref(`rooms/${roomId}/players/${currentUser?.id}`)
					.update({ deck: newCards });
			});
	}

	return (
		<CurrentUserContext.Provider
			value={{ currentUser, setCurrentUser, addCardsToDeck }}
		>
			{children}
		</CurrentUserContext.Provider>
	);
}
