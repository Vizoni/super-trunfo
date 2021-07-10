import { useEffect, useState } from "react";
import { database, firebase } from "../services/firebase";
import { useHistory, useLocation } from "react-router-dom";

type PlayersInTheRoom = {
	item: object;
	// name: string;
}

export function Room() {
	
	const history = useHistory() as any;
	// const [playersList, setPlayersList] = useState<PlayersInTheRoom[]>([]);
	const [playersList, setPlayersList] = useState([]);
	// const [roomId, setRoomId] = useState('');

	// toda vez que entra na sala a primeira vez, atualiza a listagem dos players
	useEffect(() => {
		getPlayersInTheCurrentRoom(history.location.state.roomId)
	}, [])

	function getPlayersInTheCurrentRoom(roomId: any) {
		// return await database.ref(`rooms/${roomId}`).get();
		const playersRef = database.ref(`rooms/${roomId}/players`)
		playersRef.once('value', (playerList: any) => {
			console.log("VALOR", playerList.val(), Object.getOwnPropertyNames(playerList.val()), typeof(playerList.val()))
			// setPlayersList([...playersList, playerList.val() as any])
		})
	}

	function transformPlayerObject(player: any) {
		
	}

	useEffect(() => {
		// alert("entrou novo player")
		// console.log("atualizou playrs", playersList)
	}, [playersList])

	return (
		<>
		<h1>Usuários logados:</h1>
		<div>
		{ playersList.map((player) => {
			return (
				// <h3>{player.name}</h3>
				<h3>kkk</h3>
			)
		}) }
		</div>
		</>
	);
}
