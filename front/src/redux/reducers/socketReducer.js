import { List } from 'immutable';

const initialState = { message: [], chat: [] }


const reducer = (state = initialState, action) => {

  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        message: action.message
      }

    case 'CHAT_STATE':
      return {
        ...state,
        chat: action.chat
      }
    case 'INITIAL_ITEMS':
      return {
        ...state,
        items: List(action.message)
      }
    // return {
    //     ...state,
    //     items:state.items.push({id:action.items.itemId,item:action.items.item,completed:action.items.completed})
    //   }
    default:
      return state
  }
}


export default reducer