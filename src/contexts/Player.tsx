import React, { ReactNode, useState } from "react";
import { Card } from "../interfaces/Card";

type Player = {
	id?: string;
	name: string;
	// createdAt: string;
	// deck: Card[];
};

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

	// function updatePlayerData(data: Player): void {
	// 	setPlayer(data);
	// }

	return (
		<PlayerContext.Provider value={{ player, setPlayer }}>
			{children}
		</PlayerContext.Provider>
	);
}
