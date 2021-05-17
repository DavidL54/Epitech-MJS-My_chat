import Cookies from 'js-cookie'
import { apiClient, handleResponse } from "./axios";
import jwt_decode from 'jwt-decode';

export const invitServices = {
  responseInvit,
  getAvalaibleUserInvitRoomcreate,
  getAvalaibleUserInvitRoomUpdate,
  getAvalaibleUserInvitAdmin
};

function responseInvit(id, body) {
  return apiClient.put(`/invitation/${id}`, body)
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getAvalaibleUserInvitRoomcreate() {
  return apiClient.get(`/invitation/availablecreateroom`)
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getAvalaibleUserInvitRoomUpdate(id) {
  return apiClient.get(`/invitation/availableupdateroom/${id}`)
    .then(handleResponse)
    .then(data => {
      return data
    })
}

function getAvalaibleUserInvitAdmin(id) {
  return apiClient.get(`/invitation/availableadmin/${id}`)
    .then(handleResponse)
    .then(data => {
      return data
    })
}
