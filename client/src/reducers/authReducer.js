import {FETCH_USER} from '../actions/types';

// return null, false, or user model for auth scenarios
export default function(state = null, action) {
  switch (action.type) {
      case FETCH_USER: 
      return action.payload || false; // wierd falsey trick
    default:
      return state;
  }
}
