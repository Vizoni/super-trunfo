import React, { ReactNode, useEffect, useState } from "react";
import { Card } from "../interfaces/Card";
import { Player } from "../interfaces/Player";
import { database } from "../services/firebase";

type CurrentUserContextType = {
	currentUser: Player | undefined;
	setCurrentUser: (data: Player | undefined) => void;
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

	return (
		<CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
			{children}
		</CurrentUserContext.Provider>
	);
}
