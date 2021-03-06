import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HUDComponent } from "./HUDComponent";

let roomCode = "minha sala";

let mockroom = { id: roomCode };
let mockcurrentUserDeck = [{}, {}, {}];
let mockplayers = [{}, {}];
let mockcurrentUserIsSecondPlayer = () => false;
let mockisWaitingSecondPlayer = () => false;
let mockisCurrentUserTurn = () => true;
let mockplayerIsCurrentUser = () => true;
let mockisGameOver = () => false;

jest.mock("./../hooks/useGame", () => {
	return {
		useGame: () => {
			return {
				room: {
					room: mockroom,
				},
				players: {
					players: mockplayers,
				},
				currentUser: {
					currentUserDeck: mockcurrentUserDeck,
				},
				isCurrentUserTurn: mockisCurrentUserTurn,
				isWaitingSecondPlayer: mockisWaitingSecondPlayer,
				currentUserIsSecondPlayer: mockcurrentUserIsSecondPlayer,
				playerIsCurrentUser: mockplayerIsCurrentUser,
				isGameOver: mockisGameOver,
			};
		},
	};
});

afterEach(() => {
	jest.clearAllMocks();
});

describe("<HUDComponent/ >", () => {
	it("Should render HUD Component", () => {
		render(<HUDComponent />);
		const headerHTMLTag = screen.getByTestId("hud-header");
		expect(headerHTMLTag).toBeInTheDocument();
	});

	it("Should display that currentUser is first player and has 3 cards on his deck", () => {
		render(<HUDComponent />);
		const deckAmount = screen.getByTestId("hud-deck-amount-first-player");
		expect(deckAmount).toBeInTheDocument();
		expect(deckAmount.innerHTML).toBe("3 cartas");
	});

	it("Should display that currentUser is second player and has 1 card on his deck", () => {
		mockcurrentUserIsSecondPlayer = () => true;
		mockcurrentUserDeck = [{}];
		render(<HUDComponent />);
		expect(mockplayers.length).toBe(2);
		const deckAmount = screen.getByTestId("hud-deck-amount-second-player");
		expect(deckAmount).toBeInTheDocument();
		expect(deckAmount.innerHTML).toBe("1 carta");
	});

	it("Should display the room code to share", () => {
		mockisWaitingSecondPlayer = () => true;
		render(<HUDComponent />);
		const waitingForSecondPlayerDiv = screen.getByTestId(
			"waiting-second-player"
		);
		const roomIdDiv = screen.getByTestId("room-id");
		expect(waitingForSecondPlayerDiv).toBeInTheDocument();
		expect(roomIdDiv).toHaveTextContent(roomCode);
	});

	it("Should display it's waiting for a second player to join the game", () => {
		mockisWaitingSecondPlayer = () => true;
		render(<HUDComponent />);
		const waitingForSecondPlayerDiv = screen.getByTestId(
			"waiting-second-player"
		);
		expect(waitingForSecondPlayerDiv).toBeInTheDocument();
	});

	it("Should NOT display it's waiting for a second player to join the game", () => {
		mockisWaitingSecondPlayer = () => false;
		render(<HUDComponent />);
		const waitingForSecondPlayerDiv = screen.queryByTestId(
			"waiting-second-player"
		);
		expect(waitingForSecondPlayerDiv).not.toBeInTheDocument();
	});

	it("Should display that is current user's turn", () => {
		render(<HUDComponent />);
		const isMyTurn = screen.queryByTestId("my-turn");
		expect(isMyTurn).toBeInTheDocument();
		const isOpponentTurn = screen.queryByTestId("opponent-turn");
		expect(isOpponentTurn).not.toBeInTheDocument();
	});

	it("Should display that is opponent's turn", () => {
		mockisCurrentUserTurn = () => false;
		render(<HUDComponent />);
		const isOpponentTurn = screen.queryByTestId("opponent-turn");
		expect(isOpponentTurn).toBeInTheDocument();
		const isMyTurn = screen.queryByTestId("my-turn");
		expect(isMyTurn).not.toBeInTheDocument();
	});
});
