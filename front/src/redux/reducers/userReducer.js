import { userConstants } from '../constants/userConstants';
import Cookies from 'js-cookie'
import jwt_decode from "jwt-decode";

let localUser = Cookies.get('jwt');

let initialState = {};
if (localUser) {
	var decoded = jwt_decode(localUser);
	initialState = decoded
} else {
	initialState = {};
}

export default function user(state = initialState, action) {
	switch (action.type) {
		case userConstants.GET_USER_REQUEST:
			return { ...state, loading: action.isLoading }
		case userConstants.GET_USER_SUCCESS:
			return action.user;
		case userConstants.GET_USER_FAILURE:
			return {};
		case userConstants.UNLOAD_USER:
			return {};
		default:
			return state
	}
}