import { userConstants } from "../constants/userConstants";
import { userServices } from '../services/userServices';
import { toastError, toastSuccess } from './alertActions';
import { change } from 'redux-form';

export const userActions = {
	login,
	logout,
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
					console.log(logged);
					if (logged.message && logged.message === "OK") {
						userServices.generateLoginToken(logged);
						dispatch(loginSuccess({ loggedIn: true, jwt: logged.token }))
						toastSuccess('Connexion réussie');
					}
					else if (logged.status == 401) {
						const parsedBody = JSON.parse(body);
						dispatch(change(`recover`, 'email', parsedBody.username));
						const action = { name: "Recover my password", action: { fonction: setredirectRecover, param: true }};
						toastError(logged.message, action );
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
}