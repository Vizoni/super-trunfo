import React, { ReactNode, useState } from "react";
import { Card } from "../interfaces/Card";
import { Player } from "../interfaces/Player";

type CurrentUserContextType = {
	currentUser: Player | undefined;
	setCurrentUser: (data: Player) => void;
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

	return (
		<CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
			{children}
		</CurrentUserContext.Provider>
	);
}
