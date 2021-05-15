import { List } from 'immutable';

const initialState = { message: [], chat: [] }


const reducer = (state = initialState, action) => {

  switch (action.type) {
    case 'INIT_MESSAGE':
      return {
        ...state,
        message: action.message
      }
    case 'ADD_MESSAGE':
      return {
        ...state,
        message: [...state.message, action.message]
      }

    case 'CHAT_STATE':
      return {
        ...state,
        chat: action.chat
      }

    default:
      return state
  }
}


export default reducer