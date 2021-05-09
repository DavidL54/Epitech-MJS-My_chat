
import axios from 'axios';
import config from '../../config';
import { userServices } from './userServices';
import { auth } from '../../helpers/authHeader';
import { toastr } from 'react-redux-toastr';
import { toastError } from '../actions/alertActions';

const main = axios.create();

axios.defaults.baseURL = config.API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

main.defaults.baseURL = config.API_URL;
main.defaults.headers.post['Content-Type'] = 'application/json';
main.defaults.headers.put['Content-Type'] = 'application/json';

main.interceptors.request.use(
  config => {
    const token = auth.authHeader();
    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  error => Promise.reject(error),
);

main.interceptors.response.use(undefined, (err) => {
  const { config, response: { status, data } } = err;
  return Promise.resolve({ statusText: 'KO', status, message : data !== undefined ? data : err.message });
});

export const apiClient = main;

export function handleResponse(response) {
  if (response.status) {
    if (response.status === 401) {
      toastError('You have been disconnect, please reconnect')
      userServices.logout();
    }
    else if (response.status >= 200 && response.status <= 299) {
      return response.data;
    }
    else {
      return response;
    }
  }
  else return response;
}






























/*


import axios from 'axios';
import axiosRetry from 'axios-retry';
import jwt_decode from 'jwt-decode';
import config from '../../config';
import userServices from './userServices';
import { userConstants } from '../constants/userConstants';
import store from '../../containers/App/store';
import { authHeader } from '../../helpers/authHeader';

const main = axios.create();
axiosRetry(main, { retries: 3 });

axios.defaults.baseURL = config.API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

main.defaults.baseURL = config.API_URL;
main.defaults.headers.post['Content-Type'] = 'application/json';
main.defaults.headers.put['Content-Type'] = 'application/json';

main.interceptors.request.use(
  (conf) => {
    const token = authHeader();
    if (token) {
      // eslint-disable-next-line no-param-reassign
      conf.headers.Authorization = token;
    }
    return conf;
  },
  (error) => Promise.reject(error),
);


let isRefreshing = false;

let subscribers = [];

main.interceptors.response.use(undefined, (err) => {
  const { config, response: { status } } = err;
  const originalRequest = config;
  const state = store.getState();
  const decodedToken = jwt_decode(state.authentication.auth.token);
  const userEmail = decodedToken.email;

  if (status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      userServices.refreshAuth(userEmail, state.authentication.auth.refreshToken)
        .then((response) => {
          const auth = response;
          isRefreshing = false;
          onRrefreshed(auth.token);
          store.dispatch({ type: userConstants.LOGIN_REFRESH_SUCCESS, auth });
          subscribers = [];
        });
    }
    const requestSubscribers = new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        originalRequest.headers.Authorization = `Token ${token}`;
        resolve(axios(originalRequest));
      });
    });
    return requestSubscribers;
  }
  return Promise.resolve({ statusText: 'KO', status, data: err.message });
});

function subscribeTokenRefresh(cb) {
  subscribers.push(cb);
}

function onRrefreshed(token) {
  subscribers.map((cb) => cb(token));
}

export const apiClient = main;

export function handleResponse(response) {
  const { data } = response;
  if (response.statusText !== 'OK') {
    if (response.status === 401) {
      userServices.logout();
    }
    return Promise.resolve(response);
  }
  return data;
}
*/