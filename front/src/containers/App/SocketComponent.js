import React from 'react';
import socketio from "socket.io-client";
import config from "../../config";
import { auth } from '../../helpers/authHeader'


const getSocket = () => {
  const token = auth.getAccessToken();
  if (token) {
    return socketio.connect(config.SOCKET_URL, {
      query: { token }
    });
  }
  return socketio.connect(config.SOCKET_URL);
};

export const socket = getSocket();
export const SocketContext = React.createContext();
