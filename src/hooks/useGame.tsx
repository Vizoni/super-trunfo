import { useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUser";
import { GameDeckContext } from "../contexts/GameDeck";
import { PlayersContext } from "../contexts/Players";
import { RoomContext } from "../contexts/Room";
import { Card } from "../interfaces/Card";
import { Player } from "../interfaces/Player";

export function useGame() {
	const currentUser = useContext(CurrentUserContext);
	const players = useContext(PlayersContext);
	const room = useContext(RoomContext);
	const deck = useContext(GameDeckContext);

	// main function to start listening the contexts and make them get updated regularly
	// method has to be called just two times: Or when you create a room or when someone joins it.
	async function startListenToAllContexts(roomId: string, playerId: string) {
		if (!roomId) return;
		await room.updateRoom(roomId);
		await deck.listenToDeckUpdate(roomId);
		await players.listenToPlayerUpdate(roomId);
		await currentUser.listenToCurrentUserUpdate(roomId, playerId);
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
			turn: "",
			deck: deck.generateNewGameDeck(),
		};
		const roomId = await room.createRoom(newRoom);
		newRoom.id = roomId;
		const playerId = await players.addPlayerToRoom(roomId, newPlayer);
		newPlayer.id = playerId;
		// primeiro turno é de quem criou a sala, não dá pra setar no newRoom.turn o playerId pq o playerId ainda n foi setado.
		await room.updateGameTurn(roomId, playerId);
		await currentUser.setCurrentUser(newPlayer);
		await room.setRoom(newRoom);
		await startListenToAllContexts(roomId, playerId);
		return roomId;
	}

	async function findRoom(roomId: string) {
		return await room.getRoomById(roomId);
	}

	async function joinRoom(foundRoom: any) {
		const newPlayer: Player = {
			id: "",
			createdAt: new Date().toISOString().slice(0, 10),
			deck: [],
		};
		await room.setRoom(foundRoom);
		const playerId = await players.addPlayerToRoom(foundRoom.id, newPlayer);
		newPlayer.id = playerId;
		await currentUser.setCurrentUser(newPlayer);
		await room.updateRoomWithSecondPlayer(foundRoom.id);
		await startListenToAllContexts(foundRoom.id, playerId);
	}

	async function buyCards(amountOfCards: number) {
		const newCards = deck.playerDrawCards(room.room, amountOfCards);
		currentUser.addCardsToDeck(room.room.id, newCards);
	}

	function isCurrentUserTurn() {
		if (currentUser.currentUser.id == room.room.turn) {
			return true;
		}
		return false;
	}

	function getFirstCardOfBothPlayers() {
		let firstCardOfBothPlayers: any = [];
		if (players.players.length <= 1) {
			return;
		}
		players.players.forEach((singlePlayer) => {
			firstCardOfBothPlayers.push(singlePlayer.deck[0]);
		});
		return firstCardOfBothPlayers;
	}

	function compareCards(attributeIndex: number) {
		const arrayOfFirstCards = getFirstCardOfBothPlayers();
		let firstCardPlayerOne = arrayOfFirstCards[0];
		let firstCardPlayerTwo = arrayOfFirstCards[1];
		console.log("card 1", firstCardPlayerOne);
		console.log("card 2", firstCardPlayerTwo);

		let cardWinner = "";
		if (firstCardPlayerOne.isSuperTrunfo) {
			console.log("PLAYER 1 É TRUNFO", firstCardPlayerOne);
			cardWinner = firstCardPlayerOne;
		} else if (firstCardPlayerTwo.isSuperTrunfo) {
			console.log("PLAYER 2 É TRUNFO", firstCardPlayerTwo);
			cardWinner = firstCardPlayerTwo;
		} else if (
			firstCardPlayerOne.attributes[attributeIndex] >
			firstCardPlayerTwo.attributes[attributeIndex]
		) {
			console.log("PLAYER 1 GANHOU", firstCardPlayerOne);
			cardWinner = firstCardPlayerOne;
		} else {
			cardWinner = firstCardPlayerTwo;
			console.log("PLAYER 2 GANHOU", firstCardPlayerTwo);
		}

		// FALTA ATUALIZAR O TURNO!!!
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
		isCurrentUserTurn,
		compareCards,
	};
}
