import { useContext } from "react";
import { LeaveUserContext } from "../contexts/LeaveUser";

export function useLeaveUser() {
	const value = useContext(LeaveUserContext);
	return value;
}
