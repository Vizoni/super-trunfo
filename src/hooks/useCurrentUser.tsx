import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUser";

export function useCurrentUser() {
	const value = useContext(CurrentUserContext);
	return value;
}
