import Cookies from 'js-cookie'
import { apiClient, handleResponse } from "./axios";
import jwt_decode from 'jwt-decode';

export const roomServices = {
    createRoom,
    deleteRoom,
    getRoomByUser,
    getAllowRoomByUser
};

function createRoom(body) {
    return apiClient.post(`/room`, body)
        .then(handleResponse)
        .then(data => {
            return data
        })
}

function deleteRoom(id) {
    return apiClient.delete(`/room/${id}`)
        .then(handleResponse)
        .then(data => {
            return data
        })
}

function getRoomByUser(id) {
    return apiClient.get(`/room/user/${id}`)
        .then(handleResponse)
        .then(data => {
            return data
        })
}

function getAllowRoomByUser(id) {
    return apiClient.get(`/room/allow/user/${id}`)
        .then(handleResponse)
        .then(data => {
            return data
        })
}