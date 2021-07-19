import React, { ReactNode, useState } from "react";
import { Card } from "../interfaces/Card";
import { Player } from "../interfaces/Player";

type PlayerContextType = {
	player: Player | undefined;
	setPlayer: (data: Player) => void;
};

type PlayerContextProviderProps = {
	children: ReactNode;
};

export const PlayerContext = React.createContext({} as PlayerContextType);

export function PlayerContextProvider({
	children,
}: PlayerContextProviderProps) {
	const [player, setPlayer] = useState<Player | undefined>();

	return (
		<PlayerContext.Provider value={{ player, setPlayer }}>
			{children}
		</PlayerContext.Provider>
	);
}
