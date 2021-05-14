import { List } from 'immutable';

const initialState = { message: [] }


const reducer = (state = initialState, action) => {

  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        message: action.message
      }

    case 'COMPLETED_ITEM':
      return {
        ...state,
        items: state.items.update(action.itemId - 1, (value) => {
          return { ...value, completed: action.completed }
        })
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