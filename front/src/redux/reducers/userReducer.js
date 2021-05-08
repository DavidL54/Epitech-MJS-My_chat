import { userConstants } from '../constants/userConstants';

let localUser = JSON.parse(localStorage.getItem('user'));

let initialState = {};
if (localUser) {
	initialState = { user: localUser };
} else {
	initialState = {};
}

export default function user(state = initialState, action) {
	switch (action.type) {
		case userConstants.GET_USER_REQUEST:
			return { ...state, loading: action.isLoading }
		case userConstants.GET_USER_SUCCESS:
			return { ...state, accessToken: action.accessToken, refreshToken: action.refreshToken };
		case userConstants.GET_USER_FAILURE:
			return {};
		case userConstants.UNLOAD_USER:
			return {};
		default:
			return state
	}
}