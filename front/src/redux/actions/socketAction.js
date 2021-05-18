import axios from "axios"
import { chatServices } from '../services/chatServices'

async function makeRandomId(length) {
  var result = [];
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() *
      charactersLength)));
  }
  return result.join('');
}

export const loadReceivedMessage = (socket) => {
  return (dispatch, getState) => {
    socket.on('message', async (mess, idmess, timemsg) => {
      let parsed = JSON.parse(mess)
      if (timemsg > 20)
        parsed['new'] = true;
      parsed['id'] = idmess;
      await dispatch({ type: "ADD_MESSAGE", message: parsed });
    });
  }
}

export const sendMessage = (socket, roomid, message) => {
  return async (dispatch, getState) => {
    const state = getState();
    const idmsg = await makeRandomId(20);
    await dispatch({ type: "ADD_MESSAGE", message: { sender: state.user.userId, roomid, message, idmsg } });
    socket.emit('message', state.user.userId, roomid, message, idmsg);
  }
}

export const chatHandler = (socket) => {
  return (dispatch) => {
    socket.on('chatstate', (mess) => {
      dispatch({ type: "CHAT_STATE", chat: mess });
    });
  }
}

export const tappingHandler = (socket) => {
  return (dispatch, getState) => {
    socket.on('typing', (userid, state) => {
      const currState = getState();
      if (state === true && !currState.socket.tap.includes(userid)) {
        dispatch({ type: "CHAT_TAPPING_ADD", tap: userid });
      }
      else if (state === false) {
        dispatch({ type: "CHAT_TAPPING_REMOVE", tap: userid });
      }
    });
  }
}