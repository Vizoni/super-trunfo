import { Game } from "./Game";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

let mockcurrentUser = { currentUser: { id: "" }, currentUserDeck: [{}, {}] };
let mockplayers = [
	{
		deck: [
			{
				name: "Fiat Uno",
				type: "D",
				isSuperTrunfo: false,
				image: "../fiat_uno.jpg",
				attributes: [
					{
						name: "Potência",
						value: 50,
					},
					{
						name: "Velocidade Máxima",
						value: 90,
					},
					{
						name: "Peso",
						value: 200,
					},
					{
						name: "Comprimento",
						value: 80,
					},
				],
			},
		],
	},
];
let mockroom = {
	winnerPlayerId: "",
	cardsComparison: {
		isComparingCards: false,
		attributeBeingCompared: "",
		winnerCardName: "",
		isComparingSuperTrunfoAgainstCardTypeA: false,
	},
};
let mockisWaitingSecondPlayer = () => false;
let mockplayerIsCurrentUser = () => true;
let mockcurrentUserIsSecondPlayer = () => false;
let mockisCurrentUserTurn = () => true;
let mockisGameOver = () => false;

jest.mock("./../hooks/useGame", () => {
	return {
		useGame: () => {
			return {
				players: {
					players: mockplayers,
				},
				room: {
					room: mockroom,
				},
				currentUser: mockcurrentUser,
				isWaitingSecondPlayer: mockisWaitingSecondPlayer,
				playerIsCurrentUser: mockplayerIsCurrentUser,
				currentUserIsSecondPlayer: mockcurrentUserIsSecondPlayer,
				isCurrentUserTurn: mockisCurrentUserTurn,
				isGameOver: mockisGameOver,
			};
		},
	};
});
describe("<GAME>", () => {
	it("Should render Game Component with one card", () => {
		render(<Game />);
		const gameContainer = screen.getByTestId("game-container");
		expect(gameContainer).toBeInTheDocument();
		const cardComp = screen.getAllByTestId("card-component");
		expect(cardComp).toHaveLength(1);
	});

	it("Should render div with class 'waiting-player' having one card on the screen", () => {
		mockisWaitingSecondPlayer = () => true;
		render(<Game />);
		const waitingSecnodPlayer = screen.getByTestId("is-waiting-player");
		expect(waitingSecnodPlayer).toHaveClass("waiting-player");
		const cardComp = screen.getAllByTestId("card-component");
		expect(cardComp).toHaveLength(1);
	});

	it("Should render div without class 'waiting-player' having two cards on the screen", () => {
		mockisWaitingSecondPlayer = () => false;
		mockplayers = [
			{
				deck: [
					{
						name: "Renault Clio",
						type: "C",
						isSuperTrunfo: false,
						image: "../renault_clio.jpg",
						attributes: [
							{
								name: "Potência",
								value: 150,
							},
							{
								name: "Velocidade Máxima",
								value: 110,
							},
							{
								name: "Peso",
								value: 200,
							},
							{
								name: "Comprimento",
								value: 80,
							},
						],
					},
				],
			},
			{
				deck: [
					{
						name: "Fiat Uno",
						type: "D",
						isSuperTrunfo: false,
						image: "../fiat_uno.jpg",
						attributes: [
							{
								name: "Potência",
								value: 50,
							},
							{
								name: "Velocidade Máxima",
								value: 90,
							},
							{
								name: "Peso",
								value: 200,
							},
							{
								name: "Comprimento",
								value: 80,
							},
						],
					},
				],
			},
		];

		render(<Game />);
		const waitingSecnodPlayer = screen.getByTestId("is-waiting-player");
		expect(waitingSecnodPlayer).not.toHaveClass("waiting-player");
		const cardComp = screen.getAllByTestId("card-component");
		expect(cardComp).toHaveLength(2);
	});

	it("Should render winner-modal", () => {
		const playerId = "abc1234";
		mockroom = {
			winnerPlayerId: playerId,
			cardsComparison: {
				isComparingCards: false,
				attributeBeingCompared: "",
				winnerCardName: "",
				isComparingSuperTrunfoAgainstCardTypeA: false,
			},
		};
		mockcurrentUser = {
			currentUser: { id: playerId },
			currentUserDeck: [{}, {}],
		};
		mockisGameOver = () => true;
		render(<Game />);
		const gameOver = screen.getByTestId("game-over");
		expect(gameOver).toBeInTheDocument();
		const modal = screen.queryByTestId("modal-component");
		const modalTitle = screen.queryByTestId("modal-title");
		expect(modal).toBeInTheDocument();
		expect(modalTitle).toHaveClass("modal-title victory");
	});

	it("Should render defeat-modal", () => {
		const playerId = "abc1234";
		mockroom = {
			winnerPlayerId: playerId,
			cardsComparison: {
				isComparingCards: false,
				attributeBeingCompared: "",
				winnerCardName: "",
				isComparingSuperTrunfoAgainstCardTypeA: false,
			},
		};
		mockcurrentUser = {
			currentUser: { id: "wrong-id" },
			currentUserDeck: [{}, {}],
		};
		mockisGameOver = () => true;
		render(<Game />);
		const gameOver = screen.getByTestId("game-over");
		expect(gameOver).toBeInTheDocument();
		const modal = screen.queryByTestId("modal-component");
		const modalTitle = screen.queryByTestId("modal-title");
		expect(modal).toBeInTheDocument();
		expect(modalTitle).toHaveClass("modal-title defeat");
	});
});
