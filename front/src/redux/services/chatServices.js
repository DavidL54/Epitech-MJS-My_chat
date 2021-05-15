import { apiClient, handleResponse } from "./axios";

export const chatServices = {
    getUserByRoom
};

function getUserByRoom(id) {
    return apiClient.get(`/user/room/${id}`)
        .then(handleResponse)
        .then(data => {
            return data
        })
}