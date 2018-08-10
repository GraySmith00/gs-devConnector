import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types';

const initialState = {};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    case CLEAR_ERRORS:
      return {};
    default:
      return state;
  }
}

export default authReducer;
