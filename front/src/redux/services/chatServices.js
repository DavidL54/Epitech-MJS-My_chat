import { apiClient, handleResponse } from "./axios";

export const chatServices = {
    getUserByRoom,
    getLastMessageByRoomId,
};

function getUserByRoom(id) {
    return apiClient.get(`/user/room/${id}`)
        .then(handleResponse)
        .then(data => {
            return data
        })
}

function getLastMessageByRoomId(id) {
    return apiClient.get(`/message/${id}`)
        .then(handleResponse)
        .then(data => {
            return data
        })
}