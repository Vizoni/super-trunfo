import { Card } from "./Card";

export interface Player {
	id: string;
	name: string;
	createdAt: string;
	deck: Card[];
}
