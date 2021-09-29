import React, { ReactNode, useState } from "react";
import { Card } from "../interfaces/Card";
import { Player } from "../interfaces/Player";
import { database } from "../services/firebase";

type CurrentUserContextType = {
	currentUser: Player;
	currentUserDeck: Card[];
	setCurrentUserDeck: (data: Card[]) => void;
	setCurrentUser: (data: Player) => void;
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

	async function listenToCurrentUserUpdate(roomId: string, playerId: string) {
		await database
			.ref(`rooms/${roomId}/players/${playerId}`)
			.on("value", (user) => {
				if (user.exists()) {
					setCurrentUser(user.val());
				}
			});
		await database
			.ref(`rooms/${roomId}/players/${playerId}/deck`)
			.on("value", (deck) => {
				if (deck.exists()) {
					if (!deck.val().length) {
						const arrayAuxiliarToTransformObjectIntoArrayElement = [];
						arrayAuxiliarToTransformObjectIntoArrayElement.push(deck.val());
						setCurrentUserDeck(arrayAuxiliarToTransformObjectIntoArrayElement);
					} else {
						setCurrentUserDeck(deck.val());
					}
				} else {
					setCurrentUserDeck([]);
				}
			});
	}

	return (
		<CurrentUserContext.Provider
			value={{
				currentUser,
				currentUserDeck,
				setCurrentUser,
				setCurrentUserDeck,
				listenToCurrentUserUpdate,
			}}
		>
			{children}
		</CurrentUserContext.Provider>
	);
}
