import axios from "axios"
import { chatServices } from '../services/chatServices'

export const loadReceivedMessage = (socket) => {
  return (dispatch, getState) => {
    socket.on('message', async (mess, idmess) => {
      const parsed = JSON.parse(mess)
      await chatServices.postReceivedMessage(mess);
      await dispatch({ type: "ADD_MESSAGE", message: parsed });
    });
  }
}

export const sendMessage = (socket, roomid, message) => {
  return async (dispatch, getState) => {
    const state = getState();
    await chatServices.postReceivedMessage(JSON.stringify({ sender: state.user.userId, roomid, message }))
    await dispatch({ type: "ADD_MESSAGE", message: { sender: state.user.userId, roomid, message } });
    socket.emit('message', state.user.userId, roomid, message);
  }
}

export const chatHandler = (socket) => {
  return (dispatch) => {
    socket.on('chatstate', (mess) => {
      dispatch({ type: "CHAT_STATE", chat: mess });
    });
  }
}

export const Initmessage = () => {
  return async (dispatch, getState) => {
    const oldmessage = await chatServices.getLastMessage();
    dispatch({ type: "INIT_MESSAGE", message: oldmessage });
  }
}