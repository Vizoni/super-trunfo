import { Home } from "./Home";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

const roomId = "id-da-sala-teste";

jest.mock("./../hooks/useGame", () => {
	return {
		useGame: () => {
			return {
				createNewRoom: () =>
					new Promise((resolve, reject) => {
						resolve(roomId);
					}),
				findRoom: (roomId: string) =>
					new Promise((resolve, reject) => {
						resolve({
							id: roomId,
							playersCounter: 1,
							createdAt: "2020-09-20",
							players: [],
							turn: "id-player-1",
							deck: [],
							winnerPlayerId: "id-player-1",
							cardsComparison: {},
						});
					}),
				joinRoom: (foundRoom: string) =>
					new Promise((resolve, reject) => {
						resolve(foundRoom);
					}),
			};
		},
	};
});

// X antes do IT (xit) é para NÃO executar aquele teste
describe("<HOME>", () => {
	it("Should render Home Page", () => {
		render(<Home />);
		const btnEntrar = screen.getByRole("button", {
			name: /entrar/i,
		});
		expect(btnEntrar).toBeInTheDocument();
	});

	it("Should render Room when click btn-create-room", async () => {
		const history = createMemoryHistory();
		const doPush = jest.spyOn(history, "push");
		render(
			<Router history={history}>
				<Home />
			</Router>
		);
		const btnCriarSala = screen.getByTestId("btn-create-room");
		expect(btnCriarSala).toBeInTheDocument();
		fireEvent.click(btnCriarSala);
		waitFor(() => {
			expect(doPush).toHaveBeenCalled();
			expect(doPush).toHaveBeenCalledWith({
				pathname: `/rooms/${roomId}`,
				state: { roomId: roomId },
			});
		});
	});

	it("Should join an existing room by clicking btn-join-room", () => {
		const history = createMemoryHistory();
		const doPush = jest.spyOn(history, "push");
		render(
			<Router history={history}>
				<Home />
			</Router>
		);
		const inputRoomId = screen.getByTestId("input-room-id");
		expect(inputRoomId).toBeInTheDocument();
		// expect(inputRoomId.value).toBe("");
		expect(inputRoomId).toHaveValue("");
		fireEvent.change(inputRoomId, { target: { value: roomId } });
		// expect(inputRoomId.value).toBe(roomId);
		expect(inputRoomId).toHaveValue(roomId);

		const btnJoinRoom = screen.getByTestId("btn-join-room");
		fireEvent.click(btnJoinRoom);
		waitFor(() => {
			expect(doPush).toHaveBeenCalled();
			expect(doPush).toHaveBeenCalledWith({
				pathname: `/rooms/${roomId}`,
				state: { roomId: roomId },
			});
		});
	});
});
