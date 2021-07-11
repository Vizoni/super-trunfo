import { useEffect, useState } from "react";
import { database, firebase } from "../services/firebase";
import { useHistory, useLocation } from "react-router-dom";

type PlayerInTheRoom = {
	id: string;
	name: string;
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
		const playersRef = database.ref(`rooms/${roomId}/players`)
		playersRef.on('value', (playerList: any) => {
			const playersTransformedToArray = Object.entries(playerList.val())
			let arrayAux: PlayerInTheRoom[] = []
			playersTransformedToArray.forEach((element: Array<any>) => {
				const player: PlayerInTheRoom = {
					id: element[0],
					name: element[1].name
				}
				arrayAux.push(player)
			}); 
			setPlayersList(arrayAux as any)
			
		})
	}

	return (
		<>
		<h1>Usuários logados:</h1>
		<div>
		{ playersList.map((player: PlayerInTheRoom) => {
			return (
				<h3>{player.name}</h3>
			)
		}) }
		</div>
		</>
	);
}
