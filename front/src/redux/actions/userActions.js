import { userConstants } from "../constants/userConstants";
import { userServices } from '../services/userServices';
import { toastError, toastSuccess } from './alertActions';

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

function login(body) {
	return dispatch => {
		dispatch(loginRequest({ body }));
		return userServices.login(body)
			.then(
				logged => {
					console.log(logged.data.token)
					if (logged.status && logged.status === 200) {
						userServices.generateLoginToken(logged.data);
						dispatch(loginSuccess({ loggedIn: true, jwt: logged.data.token }))
						toastSuccess('Connexion réussie');
					}
					else {
						console.log(logged.message)
						toastError(logged.message);
					}
				},
				error => {
					dispatch(loginFailure(error.toString()));
					dispatch(toastError(error));
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