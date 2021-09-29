import { useContext } from "react";
import { PlayersContext } from "../contexts/Players";

export function usePlayers() {
	const value = useContext(PlayersContext);
	return value;
}
