import axios from "axios"

export const loadReceivedMessage = (socket) => {
  return (dispatch, getState) => {
    socket.on('message', (roomid, mess) => {
      const parsed = JSON.parse(mess)
      const state = getState();
      dispatch({ type: "ADD_MESSAGE", message: [...state.socket.message, parsed] });
    });
  }
}

export const sendMessage = (socket, roomid, message) => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch({ type: "ADD_MESSAGE", message: [...state.socket.message, { user: state.user.userId, room : roomid, message}] });
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




/* export const addNewItemSocket = (socket, id, item) => {
  return (dispatch) => {
    let postData = {
      id: id + 1,
      item: item,
      completed: false
    }
    socket.emit('addItem', postData)
  }
}

export const markItemCompleteSocket = (socket, id, completedFlag) => {
  return (dispatch) => {
    let postData = {
      id: id,
      completed: completedFlag
    }
    socket.emit('markItem', postData)
  }
}*/