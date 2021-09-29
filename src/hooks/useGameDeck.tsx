import { useContext } from "react";
import { GameDeckContext } from "../contexts/GameDeck";

export function useGameDeck() {
	const value = useContext(GameDeckContext);
	return value;
}
