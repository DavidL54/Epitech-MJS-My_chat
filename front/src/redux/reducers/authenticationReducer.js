
import { userConstants } from '../constants/userConstants';
import Cookies from 'js-cookie';

let auth = Cookies.get('jwt');

let initialState = {};
if (auth) {
  initialState = {
    loggedIn: true,
    auth: {
      jwt: auth,
    }
  };
} else {
  initialState = {};
}

export default function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: false,
      };
    case userConstants.REQUEST_NEW_PASSWORD:
      return {
        requestNewPassword: true,
      };
    case userConstants.LOGIN_SUCCESS:
        return {
          loggedIn: true,
          auth: action.auth
        };
    case userConstants.LOGIN_REFRESH_REQUEST:
        return {
          ...state,
          refreshingToken: true
        }
    case userConstants.LOGIN_REFRESH_SUCCESS:
      return {
        loggedIn: true,
        auth: action.auth
      }
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.LOGIN_REFRESH_FAILURE:
      return {};

    case userConstants.LOGOUT:
      return {};
    default:
      return state
  }
}