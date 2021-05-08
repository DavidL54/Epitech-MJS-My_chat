import Cookies from 'js-cookie'
import { apiClient, handleResponse } from "./axios";

export const userServices = {
    login,
    logout,
    createUser,
    generateLoginToken
};

function generateLoginToken(auth) {
    if (auth !== undefined) {
        if (auth.token)
            Cookies.set('jwt', auth.token, { secure: true }, { sameSite: 'strict' })
    }
}

function login(body) {
    return apiClient.post(`/user/login`, body)
        .then(handleResponse)
        .then(data => {
            return data
        })
}


function createUser(body) {
    return apiClient.post(`/user/signup`, body)
        .then(handleResponse)
        .then(data => {
            return data
        })
}

function logout() {
    localStorage.clear();
    sessionStorage.clear();
    Cookies.remove('jwt');
    window.location.reload();
}