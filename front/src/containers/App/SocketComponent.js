import React from 'react';
import socketio from "socket.io-client";
import config from "../../config";


const getSocket = () => {
    return socketio.connect(config.SOCKET_URL);
};

export const socket = getSocket();
export const SocketContext = React.createContext();
