import { useContext } from "react";
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
		const roomId = await room.createRoom(newRoom, newPlayer);
		const playerId = await players.addPlayerToRoom(roomId, newPlayer);
		newPlayer.id = playerId;
		currentUser.setCurrentUser(newPlayer);
		return roomId;
	}

	async function findRoom(roomId: string) {
		return await room.getRoomById(roomId);
	}

	async function joinRoom(roomId: string) {
		const newPlayer: Player = {
			id: "",
			createdAt: new Date().toISOString().slice(0, 10),
			deck: [],
		};
		await room.updateRoomWithSecondPlayer(roomId);
		const playerId = await players.addPlayerToRoom(roomId, newPlayer);
		newPlayer.id = playerId;
		currentUser.setCurrentUser(newPlayer);
		await room.updateRoom(roomId);
		console.log("agora pode dar join", room);
	}

	async function buyCards(amountOfCards: number) {
		console.log("use game - bu ycards", room.room?.id, amountOfCards);
		const newCards = deck.playerDrawCards(room.room?.id, amountOfCards);
		currentUser.addCardsToDeck(room.room?.id, newCards);
		// console.log("use game - buy cards", newCards)
	}

	function listenToPlayerJoiningRoom() {
		players.listenToPlayerUpdate(room.room?.id);
	}

	function listenToDeckUpdate() {
		deck.listenToDeckUpdate(room.room?.id);
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
		listenToPlayerJoiningRoom,
		listenToDeckUpdate,
	};
}
