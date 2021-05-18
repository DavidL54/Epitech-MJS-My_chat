import { userConstants } from "../constants/userConstants";
import { userServices } from '../services/userServices';
import { toastError, toastSuccess } from './alertActions';
import { change } from 'redux-form';
import jwt_decode from "jwt-decode";

export const userActions = {
	login,
	logout,
	confirmandlogin
};


function logout() {
	return dispatch => {
		dispatch({ type: 'USERS_LOGGED_OUT' });
		//userServices.logout();
	}
}

function login(body, setredirectRecover) {
	return dispatch => {
		dispatch(loginRequest({ body }));
		return userServices.login(body)
			.then(
				logged => {
					if (logged.message && logged.message === "OK") {
						userServices.generateLoginToken(logged);
						var decoded = jwt_decode(logged.token);
						localStorage.setItem('user', decoded)
						dispatch(loginSuccess({ loggedIn: true, jwt: logged.token }))
						dispatch(dispatchUser(decoded));
						toastSuccess('You have been authenticated');
					}
					else if (logged.status == 401 || logged.status == 404) {
						const parsedBody = JSON.parse(body);
						dispatch(change(`recover`, 'email', parsedBody.username));
						const action = { name: "Recover my password", action: { fonction: setredirectRecover, param: true } };
						toastError(logged.message, action);
					}
					else if (logged.status == 409) {
						toastError(logged.message);
					}
					else {
						toastError(logged.message);
					}
				},
				error => {
					dispatch(loginFailure(error.toString()));
					toastError(error);
				}
			)
			.catch((error) => {
				console.error(error);
			})
	};

	function loginRequest() { return { type: userConstants.LOGIN_REQUEST } }
	function loginSuccess(auth) { return { type: userConstants.LOGIN_SUCCESS, auth } }
	function loginFailure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
	function dispatchUser(user) { return { type: userConstants.GET_USER_SUCCESS, user } }
}

function confirmandlogin(logged, setredirectcontact) {
	return dispatch => {
		userServices.generateLoginToken(logged);
		var decoded = jwt_decode(logged.token);
		localStorage.setItem('user', decoded)
		dispatch(loginSuccess({ loggedIn: true, jwt: logged.token }))
		dispatch(dispatchUser(decoded));
		toastSuccess(logged.result);
		setredirectcontact(true);
	};

	function loginSuccess(auth) { return { type: userConstants.LOGIN_SUCCESS, auth } }
	function dispatchUser(user) { return { type: userConstants.GET_USER_SUCCESS, user } }
}