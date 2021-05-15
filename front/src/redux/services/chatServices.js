import { apiClient, handleResponse } from "./axios";

export const chatServices = {
    getUserByRoom,
    postReceivedMessage,
    getLastMessage,
};

function getUserByRoom(id) {
    return apiClient.get(`/user/room/${id}`)
        .then(handleResponse)
        .then(data => {
            return data
        })
}

function postReceivedMessage(body) {
    return apiClient.post(`/message`, body)
        .then(handleResponse)
        .then(data => {
            return data
        })
}

function getLastMessage(body) {
    return apiClient.get(`/message`)
        .then(handleResponse)
        .then(data => {
            return data
        })
}