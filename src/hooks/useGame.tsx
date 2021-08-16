import { useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUser";
import { GameDeckContext } from "../contexts/GameDeck";
import { PlayersContext } from "../contexts/Players";
import { RoomContext } from "../contexts/Room";
import { Player } from "../interfaces/Player";

export function useGame() {
	const currentUser = useContext(CurrentUserContext);
	const players = useContext(PlayersContext);
	const room = useContext(RoomContext);
	const deck = useContext(GameDeckContext);

	// main function to start listening the contexts and make them get updated regularly
	// method has to be called just two times: Or when you create a room or when someone joins it.
	async function startListenToAllContexts(roomId: string) {
		if (!roomId) return;
		await room.updateRoom(roomId);
		await players.listenToPlayerUpdate(roomId);
		await deck.listenToDeckUpdate(roomId);
	}

	async function createNewRoom() {
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
			deck: deck.generateNewGameDeck(),
		};
		const roomId = await room.createRoom(newRoom);
		await startListenToAllContexts(roomId);
		const playerId = await players.addPlayerToRoom(roomId, newPlayer);
		newPlayer.id = playerId;
		currentUser.setCurrentUser(newPlayer);
		return roomId;
	}

	async function findRoom(roomId: string) {
		return await room.getRoomById(roomId);
	}

	async function joinRoom(roomId: string) {
		startListenToAllContexts(roomId);
		const newPlayer: Player = {
			id: "",
			createdAt: new Date().toISOString().slice(0, 10),
			deck: [],
		};
		const playerId = await players.addPlayerToRoom(roomId, newPlayer);
		newPlayer.id = playerId;
		currentUser.setCurrentUser(newPlayer);
		room.updateRoomWithSecondPlayer(roomId);
	}

	async function buyCards(amountOfCards: number) {
		const newCards = deck.playerDrawCards(room.room?.id, amountOfCards);
		currentUser.addCardsToDeck(room.room?.id, newCards);
	}

	return {
		currentUser,
		players,
		room,
		deck,
		createNewRoom,
		findRoom,
		joinRoom,
		buyCards,
		startListenToAllContexts,
	};
}
