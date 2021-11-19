import {
  REQUEST_USER_SIGNUP,
  REQUEST_USER_SIGNUP_SUCCESS,
  REQUEST_USER_SIGNUP_FAIL,
  RESET_STATE,
} from "./signup.types";

const INITIAL_STATE = {
  loading: false,
  success: false,
  error: "",
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUEST_USER_SIGNUP:
      return {
        ...state,
        loading: true,
      };
    case REQUEST_USER_SIGNUP_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
      };
    case REQUEST_USER_SIGNUP_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case RESET_STATE:
      return {
        ...state,
        loading:false
      };
    default:
      return state;
  }
};
export default reducer;
