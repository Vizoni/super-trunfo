import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ModalComponent } from "./ModalComponent";

import React from "react";

// afterEach(() => {
// 	jest.clearAllMocks();
// });

let props = {
	display: true,
	userWon: true,
	title: "VITÓRIA!",
	subTitle: "Parabéns, você venceu o duelo!",
	text: "Volte para o Lobby para encontrar um novo oponente!",
	btnLabel: "Voltar para o Lobby",
	closeFunction: jest.fn(),
};

describe("<ModalComponent/ >", () => {
	it("Should render ModalComponent Component", () => {
		render(<ModalComponent {...props} />);
		const mainDiv = screen.getByTestId("modal-component");
		expect(mainDiv).toBeInTheDocument();
	});

	it("Should display Victory title", () => {
		render(<ModalComponent {...props} />);
		const titleHTML = screen.getByTestId("modal-title");
		expect(titleHTML).toHaveClass("modal-title victory");
	});

	it("Should display Defeat title", () => {
		props.userWon = false;
		render(<ModalComponent {...props} />);
		const titleHTML = screen.getByTestId("modal-title");
		expect(titleHTML).toHaveClass("modal-title defeat");
	});

	it("Should display button label just as it receives in props", () => {
		render(<ModalComponent {...props} />);
		const button = screen.getByTestId("btn-label");
		expect(button).toHaveTextContent(props.btnLabel);
	});

	it("Should display default label ('OK') for the button", () => {
		props.btnLabel = "";
		render(<ModalComponent {...props} />);
		const button = screen.getByTestId("btn-label");
		expect(button).toHaveTextContent("OK");
	});

	// xit("Should close modal", () => {
	// 	render(<ModalComponent {...props} />);
	// 	const button = screen.getByTestId("btn-label");
	// 	fireEvent.click(button);
	// 	expect(props.closeFunction).toBeCalledTimes(1);
	// });
});
