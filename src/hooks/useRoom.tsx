import { useContext } from "react";
import { RoomContext } from "../contexts/Room";

export function useRoom() {
	const value = useContext(RoomContext);
	return value;
}
