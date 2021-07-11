import { useEffect, useState } from "react";
import { database, firebase } from "./firebase";
import { useHistory, useLocation } from "react-router-dom";
import { Card } from "../interfaces/Card";

export function cardInfo() {
	

	const getCardsInfo = async () => {
		return [
			{
				name: 'Renault Clio',
				type: 'B',
				attributes: [
					{
						name: 'Potência',
						value: '150'
					}
				]
			},
			{
				name: 'Ford Focus',
				type: 'A',
				attributes: [
					{
						name: 'Potência',
						value: '300'
					}
				]
			},
		] as Card[]
	}

	const history = useHistory() as any;
	// const [playersList, setPlayersList] = useState<PlayersInTheRoom[]>([]);
	const [playersList, setPlayersList] = useState([]);
	// const [roomId, setRoomId] = useState('');


}
