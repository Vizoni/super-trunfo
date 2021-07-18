import { CardAttribute } from "./CardAttribute";

export interface Card {
    name: string;
    type: string;
    isSuperTrunfo: boolean;
    attributes: CardAttribute[]
}