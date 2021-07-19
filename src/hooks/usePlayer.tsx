import { useContext } from "react";
import { PlayerContext } from "../contexts/Player";

export function usePlayer() {
	const value = useContext(PlayerContext);
	return value;
}
