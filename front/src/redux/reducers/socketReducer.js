import { List } from 'immutable';

const initialState = { message: [], chat: [], tap: [] }


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
    case 'CHAT_TAPPING_ADD':
      return {
        ...state,
        tap: [...state.tap, action.tap]
      }
    case 'CHAT_TAPPING_REMOVE':
      return {
        ...state,
        tap: state.tap.filter(item => item !== action.tap),
      }
    default:
      return state
  }
}


export default reducer