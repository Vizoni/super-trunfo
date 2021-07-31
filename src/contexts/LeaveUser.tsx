import React, { ReactNode, useEffect, useState } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Player } from "../interfaces/Player";

type LeaveUserContextType = {
	currentUser: Player | undefined;
	setCurrentUser: (data: Player | undefined) => void;
	userExit: () => void;
};

type LeaveUserContextProviderProps = {
	children: ReactNode;
};

export const LeaveUserContext = React.createContext({} as LeaveUserContextType);

export function LeaveUserContextProvider({
	children,
}: LeaveUserContextProviderProps) {
	const { currentUser, setCurrentUser } = useCurrentUser();

	function userExit() {
		window.addEventListener("beforeunload", (ev) => {
			ev.preventDefault();
			let roomId = window.location.pathname.substr(7);
			console.log("A ROOM ID é", roomId);
			console.log("VAI ATUALIZAR", window.location);
			console.log("USER", currentUser);
			if (ev) {
				ev.returnValue = "";
			}
			// FAZ A PARADA
			setCurrentUser(undefined);
			return "";
		});
		window.addEventListener("popstate", (ev) => {
			ev.preventDefault();
			let roomId = window.location.pathname.substr(7);
			console.log("A ROOM ID é", roomId);
			console.log("VAI VOLTAR", window.location);
			console.log("USER", currentUser);
			// FAZ A PARADA
			setCurrentUser(undefined);
			return "";
		});
	}

	function updateRoomWithUserLeave() {}

	return (
		<LeaveUserContext.Provider
			value={{ currentUser, setCurrentUser, userExit }}
		>
			{children}
		</LeaveUserContext.Provider>
	);
}
