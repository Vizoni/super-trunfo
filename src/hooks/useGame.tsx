import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUser";
import { PlayersContext } from "../contexts/Players";
import { RoomContext } from "../contexts/Room";
import { Player } from "../interfaces/Player";

export function useGame() {
	const currentUserContext = useContext(CurrentUserContext);
	const playersContext = useContext(PlayersContext);
	const roomContext = useContext(RoomContext);

	async function createNewRoom() {
		console.log("USEGAME -> create new room");
		const newPlayer: Player = {
			id: "",
			createdAt: new Date().toISOString().slice(0, 10),
			deck: [],
		};
		const newRoom = {
			id: "",
			createdAt: new Date().toISOString().slice(0, 10),
			playersCounter: 1,
			players: [],
			turn: "Player 1",
			// gameDeck: shuffle(PACK_OF_CARDS),
		};
		const roomId = await roomContext.createRoom(newRoom, newPlayer);
		const playerId = await playersContext.addPlayerToRoom(roomId, newPlayer);
		newPlayer.id = playerId;
		currentUserContext.setCurrentUser(newPlayer);
	}

	async function findRoom(roomId: string) {
		return await roomContext.getRoomById(roomId);
	}

	async function joinRoom(roomId: string) {
		const newPlayer: Player = {
			id: "",
			createdAt: new Date().toISOString().slice(0, 10),
			deck: [],
		};
		roomContext.updateRoomWithSecondPlayer(roomId);
		const playerId = await playersContext.addPlayerToRoom(roomId, newPlayer);
		newPlayer.id = playerId;
		currentUserContext.setCurrentUser(newPlayer);
		roomContext.updateRoom(roomId);
	}

	return {
		currentUserContext,
		playersContext,
		roomContext,
		createNewRoom,
		findRoom,
		joinRoom,
	};
}
