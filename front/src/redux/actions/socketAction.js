import axios from "axios"

/*export const AddItem = (data) => ({
  type: "ADD_MESSAGE",
  user: data.user,
  room: data.room,
  message: data.message
})

export const completeItem = (data) => ({
  type: "COMPLETED_ITEM",
  itemId: data.id,
  completed: data.completed
})

//Used only by actions for sockets 
export const initialItems = (res) => ({
  type: "INITIAL_ITEMS",
  items: res
})*/


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