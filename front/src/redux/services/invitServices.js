import Cookies from 'js-cookie'
import { apiClient, handleResponse } from "./axios";
import jwt_decode from 'jwt-decode';

export const invitServices = {
  responseInvit
};

function responseInvit(id, body) {
  return apiClient.put(`/invitation/${id}`, body)
    .then(handleResponse)
    .then(data => {
      return data
    })
}