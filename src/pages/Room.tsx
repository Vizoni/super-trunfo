import React, { useEffect, useState } from "react";
import { database, firebase } from "../services/firebase";
import { useHistory, useLocation } from "react-router-dom";
import { Game } from "./Game";
import { Player } from "../interfaces/Player";
import { useCurrentUser } from "../hooks/useCurrentUser";

export function Room() {
	const history = useHistory() as any;
	const [playersList, setPlayersList] = useState<Player[]>([]);
	const { currentUser, setCurrentUser } = useCurrentUser();
	// const [playersList, setPlayersList] = useState<Array<Player>>([]);
	// const [roomId, setRoomId] = useState('');

	// toda vez que entra na sala a primeira vez, atualiza a listagem dos players
	// useEffect(() => {
	// 	getPlayersInTheCurrentRoom(history.location.state.roomId);
	// }, []);

	// function getPlayersInTheCurrentRoom(roomId: any) {
	// 	const playersRef = database.ref(`rooms/${roomId}/players`);
	// 	playersRef.on("value", (playerList: any) => {
	// 		const playersTransformedToArray = Object.entries(playerList.val());
	// 		let arrayAux: Array<Player> = [];
	// 		playersTransformedToArray.forEach((element: Array<any>) => {
	// 			// seta o player atual com as infos que precisa
	// 			if (currentUser && currentUser.name == element[1].name) {
	// 				setCurrentUser({
	// 					...currentUser,
	// 					id: element[0],
	// 					// createdAt: element[1].createdAt,
	// 					// deck: [],
	// 				});
	// 			}
	// 			const singlePlayer: Player = {
	// 				id: element[0],
	// 				name: element[1].name,
	// 				createdAt: element[1].createdAt,
	// 				deck: [],
	// 			};
	// 			arrayAux.push(singlePlayer);
	// 		});
	// 		setPlayersList(arrayAux as any);
	// 	});
	// }

	// return (
	// <>
	// 	<h1>Usuários logados:</h1>
	// 	<div>
	// 		{/* {playersList.map((player: Player) => {
	// 			return <h3>{player.id}</h3>;
	// 		})} */}
	// 	</div>
	// 	{playersList.length > 0 && <Game players={playersList}></Game>}
	// </>
	// );
	return <h1></h1>;
}
