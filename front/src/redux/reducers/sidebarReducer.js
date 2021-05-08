import { sidebarConstants } from '../constants/sidebarConstants';

let localSidebar = JSON.parse(localStorage.getItem('sidebar'));

let initialState = {};
if (localSidebar) {
    initialState = {
        visibility: localSidebar
    };
}

export default function sidebar(state = initialState, action) {
    switch (action.type) {
        case sidebarConstants.VISIBILITY:
            return { ...state, visibility: action.state }
        default:
            return state
    }
}