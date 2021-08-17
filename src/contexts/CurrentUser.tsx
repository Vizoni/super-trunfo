import React, { ReactNode, useEffect, useState } from "react";
import { Card } from "../interfaces/Card";
import { Player } from "../interfaces/Player";
import { database } from "../services/firebase";

type CurrentUserContextType = {
	currentUser: Player;
	currentUserDeck: Card[];
	setCurrentUserDeck: (data: Card[]) => void;
	setCurrentUser: (data: Player) => void;
	addCardsToDeck: (roomId: string, newCards: Card[]) => void;
	listenToCurrentUserUpdate: (roomId: string, playerId: string) => void;
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
	const [currentUser, setCurrentUser] = useState<Player>({
		id: "",
		createdAt: "",
		deck: [],
	});
	const [currentUserDeck, setCurrentUserDeck] = useState<Card[]>([]);

	useEffect(() => {
		console.log("CURRENTUSER - Context:", currentUser);
	}, [currentUser]);

	// check if there is already any card on current users deck
	// if already has cards then add the new Cards at the last position
	// if doesn't has cards yet, it add the draw cards to it first position
	async function addCardsToDeck(roomId: string, newCards: Card[]) {
		await database
			.ref(`rooms/${roomId}/players/${currentUser.id}/deck`)
			.once("value", (currentDeck) => {
				if (currentDeck.exists()) {
					newCards = [...currentDeck.val(), ...newCards];
				}
				database
					.ref(`rooms/${roomId}/players/${currentUser.id}`)
					.update({ deck: newCards });
			});
		setCurrentUserDeck(newCards);
	}

	async function listenToCurrentUserUpdate(roomId: string, playerId: string) {
		await database
			.ref(`rooms/${roomId}/players/${playerId}`)
			.on("value", (user) => {
				if (user.exists()) {
					setCurrentUser(user.val());
				}
			});
	}

	return (
		<CurrentUserContext.Provider
			value={{
				currentUser,
				setCurrentUser,
				currentUserDeck,
				setCurrentUserDeck,
				addCardsToDeck,
				listenToCurrentUserUpdate,
			}}
		>
			{children}
		</CurrentUserContext.Provider>
	);
}
