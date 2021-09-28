import { CardComponent } from "./CardComponent";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

let mockroom = {
	winnerPlayerId: "",
	cardsComparison: {
		isComparingCards: false,
		attributeBeingCompared: "Potência",
		winnerCardName: "Renault Clio",
		isComparingSuperTrunfoAgainstCardTypeA: false,
	},
};
let mockisWaitingSecondPlayer = () => false;
let mockisCurrentUserTurn = () => true;

jest.mock("./../hooks/useGame", () => {
	return {
		useGame: () => {
			return {
				room: {
					room: mockroom,
				},
				isWaitingSecondPlayer: mockisWaitingSecondPlayer,
				isCurrentUserTurn: mockisCurrentUserTurn,
				cardMatch: jest.fn(),
			};
		},
	};
});

let props = {
	currentCard: {
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
	display: true,
	key: 0,
};

describe("<CARDCOMPONENT/>", () => {
	it("Should render a Card Component default", () => {
		render(<CardComponent {...props} />);
		const gameContainer = screen.getByTestId("card-component");
		expect(gameContainer).toBeInTheDocument();
	});

	it("Should render a Card Component winner-card", () => {
		render(<CardComponent {...props} />);
		const gameContainer = screen.getByTestId("card-component");
		expect(gameContainer).toHaveClass("flip-container winner-card");
	});

	it("Should not render a Card Component with face down and winner-card class at the same time", () => {
		render(<CardComponent {...props} />);
		const gameContainer = screen.getByTestId("card-component");
		expect(gameContainer).not.toHaveClass("do-flip winner-card");
	});

	it("Should render a Card Component not the winner card", () => {
		mockroom.cardsComparison.winnerCardName = "Ford Focus";
		render(<CardComponent {...props} />);
		const gameContainer = screen.getByTestId("card-component");
		expect(gameContainer).toHaveClass("flip-container");
	});

	it("Should render a Card Component face down", () => {
		props.display = false;
		render(<CardComponent {...props} />);
		const gameContainer = screen.getByTestId("card-component");
		expect(gameContainer).toBeInTheDocument();
		expect(gameContainer).toHaveClass("do-flip");
	});

	it("Should render the super-trunfo label for the card", () => {
		props.currentCard.isSuperTrunfo = true;
		render(<CardComponent {...props} />);
		const superTrunfoLabel = screen.getByTestId("super-trunfo-label");
		expect(superTrunfoLabel).toBeInTheDocument();
		expect(superTrunfoLabel).toHaveTextContent("SUPER TRUNFO");
	});

	it("Should not render the super-trunfo label for the card", () => {
		props.currentCard.isSuperTrunfo = false;
		render(<CardComponent {...props} />);
		const superTrunfoLabel = screen.queryByTestId("super-trunfo-label");
		expect(superTrunfoLabel).not.toBeInTheDocument();
	});

	it("Should not highlight current card because it's not A type", () => {
		render(<CardComponent {...props} />);
		const superTrunfoLabel = screen.queryByTestId("high-light-a-type");
		expect(superTrunfoLabel).not.toHaveClass("high-light-type animation-blink");
	});

	it("Should highlight current card because it's A type against a super-trunfo card", () => {
		mockroom.cardsComparison.isComparingSuperTrunfoAgainstCardTypeA = true;
		props.currentCard.type = "A";
		render(<CardComponent {...props} />);
		const superTrunfoLabel = screen.getByTestId("high-light-a-type");
		expect(superTrunfoLabel).toHaveClass("high-light-type animation-blink");
	});

	it("Should blur the whole attribute list if it's a super-trunfo card against an A-type card", () => {
		mockroom.cardsComparison.isComparingSuperTrunfoAgainstCardTypeA = true;
		render(<CardComponent {...props} />);
		const attrList = screen.getByTestId("attr-list");
		expect(attrList).toHaveClass("blur");
	});

	it("Should not blur the whole attribute list if it's a super-trunfo card against an A-type card", () => {
		mockroom.cardsComparison.isComparingSuperTrunfoAgainstCardTypeA = false;
		render(<CardComponent {...props} />);
		const attrList = screen.getByTestId("attr-list");
		expect(attrList).not.toHaveClass("blur");
	});

	it("Should render the attribute list with all it's attributes", () => {
		render(<CardComponent {...props} />);
		const attrList = screen.getAllByTestId("attr-row");
		expect(attrList).toHaveLength(4);
	});

	it("Should change cursor so user can't click in the attribute to compare it", () => {
		mockisCurrentUserTurn = () => false;
		render(<CardComponent {...props} />);
		const attrList = screen.getAllByTestId("attr-row");
		expect(attrList[0]).not.toHaveClass("clickable");
	});

	it("Should change cursor so user can't click in the attribute to compare it", () => {
		mockisWaitingSecondPlayer = () => true;
		render(<CardComponent {...props} />);
		const attrList = screen.getAllByTestId("attr-row");
		expect(attrList[0]).not.toHaveClass("clickable");
	});

	it("Should change cursor so user can't click in the attribute to compare it", () => {
		mockisCurrentUserTurn = () => true;
		mockisWaitingSecondPlayer = () => false;
		render(<CardComponent {...props} />);
		const attrList = screen.getAllByTestId("attr-row");
		expect(attrList[0]).toHaveClass("clickable");
	});

	it("Should fire event when first attribute is clicked", () => {
		mockisCurrentUserTurn = () => true;
		mockisWaitingSecondPlayer = () => false;
		render(<CardComponent {...props} />);
		const attrList = screen.getAllByTestId("attr-row");
		fireEvent.click(attrList[0]);
		waitFor(() => {
			expect(attrList[0]).toHaveBeenCalled();
			expect(attrList[0]).toHaveBeenCalledWith(0);
		});
	});
});
