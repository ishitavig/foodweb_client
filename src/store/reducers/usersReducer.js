import { SET_USER } from "../actions/actionTypes";

const initialState = {
  user: {},
};

export default function userState(state = initialState, action) {
  switch (action.type) {
    case SET_USER: {
      return {
        ...state,
        user: action.payload,
      };
    }
    default:
      return state;
  }
}
