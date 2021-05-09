import Cookies from 'js-cookie'
import { apiClient, handleResponse } from "./axios";
import jwt_decode from 'jwt-decode';

export const userServices = {
    login,
    logout,
    createUser,
    generateLoginToken,
    recover,
    resetpasswordCallback,
    getAll
};

function generateLoginToken(auth) {
    if (auth !== undefined) {
        if (auth.token) {
            Cookies.set('jwt', auth.token, { secure: true }, { sameSite: 'strict' })
            var decoded = jwt_decode(auth.token);
            localStorage.setItem('user',decoded)
        }
    }
}

function login(body) {
    return apiClient.post(`/user/login`, body)
        .then(handleResponse)
        .then(data => {
            return data
        })
}

function recover(body) {
    return apiClient.put(`/user/forgotpassword`, body)
        .then(handleResponse)
        .then(data => {
            return data
        })
}

function resetpasswordCallback(token, body) {
    return apiClient.post(`/user/resetpassword/${token}`, body)
        .then(handleResponse)
        .then(data => {
            return data
        })
}

function getAll() {
    return apiClient.get(`/user`)
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