import { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUser";
import { GameDeckContext } from "../contexts/GameDeck";
import { PlayersContext } from "../contexts/Players";
import { RoomContext } from "../contexts/Room";
import { Card } from "../interfaces/Card";
import { Player } from "../interfaces/Player";
import { PACK_OF_CARDS } from "../services/packOfCards";

export function useGame() {
	const currentUser = useContext(CurrentUserContext);
	const players = useContext(PlayersContext);
	const room = useContext(RoomContext);
	const deck = useContext(GameDeckContext);

	// everytime the current user's deck changes checks if the game is over
	useEffect(() => {
		isGameOver();
	}, [currentUser.currentUserDeck]);

	// checks if the current user deck has the same ammount of cards from the full deck. If so, he's the winner.
	function isGameOver() {
		if (currentUser.currentUserDeck.length == PACK_OF_CARDS.length) {
			room.updateRoomWithWinnerPlayer(currentUser.currentUser.id);
		}
	}

	function isWaitingSecondPlayer() {
		return players.players.length == 1 ? true : false;
	}

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
			winnerPlayerId: "",
			cardsComparison: {
				isComparingCards: false,
				attributeBeingCompared: "",
				winnerCardName: "",
				isComparingSuperTrunfoAgainstCardTypeA: false,
			},
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

	async function buyCardsForGameStart() {
		// player buys half of deck
		const newCards = deck.playerDrawCards(
			room.room,
			Math.round(PACK_OF_CARDS.length / 2)
		);
		players.addCardsToDeck(room.room.id, currentUser.currentUser.id, newCards);
	}

	function isCurrentUserTurn() {
		return currentUser.currentUser.id == room.room.turn ? true : false;
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

	async function cardMatch(attributeIndex: number) {
		const winnerOfMatchObject = compareCards(attributeIndex);
		room.updateRoomIsComparingCards(
			true,
			winnerOfMatchObject.attributeCompared,
			winnerOfMatchObject.cardsToReceive[1].name,
			winnerOfMatchObject.isComparingSuperTrunfoAgainstCardTypeA
		);
		setTimeout(() => {
			let cardsRelated = [];
			cardsRelated = winnerOfMatchObject.cardsToReceive;
			room.updateRoomIsComparingCards(false, "", "", false);
			players.removeFirstCardFromDeck(
				room.room.id,
				winnerOfMatchObject.winnerPlayerId
			);
			players.addCardsToDeck(
				room.room.id,
				winnerOfMatchObject.winnerPlayerId,
				cardsRelated
			);
			players.removeFirstCardFromDeck(
				room.room.id,
				winnerOfMatchObject.loserPlayerId
			);
			if (winnerOfMatchObject.winnerPlayerId !== room.room.turn) {
				room.updateGameTurn(room.room.id, winnerOfMatchObject.winnerPlayerId);
			}
		}, 5000);
	}

	function compareCards(attributeIndex: number) {
		const arrayOfFirstCards = getFirstCardOfBothPlayers();
		const firstCardPlayerOne = arrayOfFirstCards[0] as Card;
		const firstCardPlayerTwo = arrayOfFirstCards[1] as Card;
		const player1 = players.players[0] as Player;
		const player2 = players.players[1] as Player;
		let combatObjectResponse = {
			cardsToReceive: [] as Card[],
			winnerPlayerId: "",
			loserPlayerId: "",
			attributeCompared: firstCardPlayerOne.attributes[attributeIndex].name,
			isComparingSuperTrunfoAgainstCardTypeA: false,
		};

		if (firstCardPlayerOne.isSuperTrunfo && firstCardPlayerTwo.type != "A") {
			combatObjectResponse.cardsToReceive.push(
				firstCardPlayerTwo,
				firstCardPlayerOne
			);
			combatObjectResponse.winnerPlayerId = player1.id;
			combatObjectResponse.loserPlayerId = player2.id;
		} else if (
			firstCardPlayerOne.isSuperTrunfo &&
			firstCardPlayerTwo.type == "A"
		) {
			combatObjectResponse.cardsToReceive.push(
				firstCardPlayerOne,
				firstCardPlayerTwo
			);
			combatObjectResponse.winnerPlayerId = player2.id;
			combatObjectResponse.loserPlayerId = player1.id;
			combatObjectResponse.isComparingSuperTrunfoAgainstCardTypeA = true;
		} else if (
			firstCardPlayerTwo.isSuperTrunfo &&
			firstCardPlayerOne.type != "A"
		) {
			combatObjectResponse.cardsToReceive.push(
				firstCardPlayerOne,
				firstCardPlayerTwo
			);
			combatObjectResponse.winnerPlayerId = player2.id;
			combatObjectResponse.loserPlayerId = player1.id;
		} else if (
			firstCardPlayerTwo.isSuperTrunfo &&
			firstCardPlayerOne.type == "A"
		) {
			combatObjectResponse.cardsToReceive.push(
				firstCardPlayerTwo,
				firstCardPlayerOne
			);
			combatObjectResponse.winnerPlayerId = player1.id;
			combatObjectResponse.loserPlayerId = player2.id;
			combatObjectResponse.isComparingSuperTrunfoAgainstCardTypeA = true;
		} else if (
			firstCardPlayerOne.attributes[attributeIndex].value >
			firstCardPlayerTwo.attributes[attributeIndex].value
		) {
			combatObjectResponse.cardsToReceive.push(
				firstCardPlayerTwo,
				firstCardPlayerOne
			);
			combatObjectResponse.winnerPlayerId = player1.id;
			combatObjectResponse.loserPlayerId = player2.id;
		} else {
			combatObjectResponse.cardsToReceive.push(
				firstCardPlayerOne,
				firstCardPlayerTwo
			);
			combatObjectResponse.winnerPlayerId = player2.id;
			combatObjectResponse.loserPlayerId = player1.id;
		}
		return combatObjectResponse;
	}

	// TODO BUG: Se um usuário sai e outro entra, esse novo segundo player fica com as mesmas cartas do player 1
	function userLeaveGame() {
		room.removeUser(currentUser.currentUser);
	}

	return {
		currentUser,
		players,
		room,
		deck,
		createNewRoom,
		findRoom,
		joinRoom,
		buyCardsForGameStart,
		startListenToAllContexts,
		isCurrentUserTurn,
		cardMatch,
		userLeaveGame,
		isWaitingSecondPlayer,
	};
}
