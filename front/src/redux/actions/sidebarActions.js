import { sidebarConstants } from "../constants/sidebarConstants";

export const sidebarActions = {
	setSidebarState
};

function setSidebarState(state) {
	localStorage.setItem('sidebar', state);
	return dispatch => {
		dispatch({ type: sidebarConstants.VISIBILITY, state });
	}
}