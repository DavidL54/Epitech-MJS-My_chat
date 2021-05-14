import { combineReducers, createStore, applyMiddleware } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { reducer as toastrReducer } from 'react-redux-toastr'
import {
    userReducer,
    authenticationReducer,
    sidebarReducer,
    alertReducer,
    socketReducer
} from '../../redux/reducers/index';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const middlewares = [thunk, logger];
// const middlewares = [thunk];

const appReducer = combineReducers({
    toastr: toastrReducer,
    form: reduxFormReducer, // mounted under "form",
    alert: alertReducer,
    user: userReducer,
    authentication: authenticationReducer,
    sidebar: sidebarReducer,
    socket: socketReducer,
});

const rootReducer = (state, action) => {
    // when a logout action is dispatched it will reset redux state
    if (action.type === 'USER_LOGGED_OUT') {
        state = undefined;
    }

    return appReducer(state, action);
};

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;