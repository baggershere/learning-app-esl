import {
  REQUEST_LOGIN,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_FAILED,
  SET_USER_STATE,
  FETCH_INITIAL_STATE,
  FETCH_INITIAL_STATE_SUCCESS,
  FETCH_INITIAL_STATE_FAIL,
  RESET_USER_STATE,
  SET_SELECTED_CHILD,
  RESET_SELECTED_CHILD,
  SWITCH_LANGUAGE
} from "./user.types";

const INITIAL_STATE = {
  loadingLogin: false,
  name: "",
  email: "",
  error: "",
  loading: true,
  isAuth: false,
  selectedChild: "",
  language: "English"
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_INITIAL_STATE:
      return {
        ...state,
        loading: true,
      };
    case FETCH_INITIAL_STATE_SUCCESS:
      return {
        ...state,
        name: action.payload.data.name,
        email: action.payload.data.email,
        isAuth: true,
        loading: false,
        selectedChild: action.payload.data.selectedChild,
      };
    case FETCH_INITIAL_STATE_FAIL:
      return {
        ...state,
        loading: false,
        isAuth: false,
      };
    case REQUEST_LOGIN:
      return {
        ...state,
        loadingLogin: true,
        isAuth: false,
      };
    case REQUEST_LOGIN_SUCCESS:
      return {
        ...state,
        loadingLogin: false,
        isAuth: true,
        name: action.payload.name,
        email: action.payload.email,
        token: action.payload.token,
      };
    case REQUEST_LOGIN_FAILED:
      return {
        ...state,
        loadingLogin: false,
        isAuth: false,
        error: action.payload,
        name: "",
        email: "",
        token: "",
      };
    case SET_USER_STATE:
      return {
        ...state,
        name: action.payload.name,
        email: action.payload.email,
      };
    case RESET_USER_STATE:
      return {
        ...state,
        isAuth: false,
        name: "",
        email: "",
        children: [],
        token: "",
      };
    case SET_SELECTED_CHILD:
      return {
        ...state,
        selectedChild: action.payload,
      };
    case RESET_SELECTED_CHILD:
      return {
        ...state,
        selectedChild: action.payload,
      };
    case SWITCH_LANGUAGE:
      return {
        ...state,
        language: action.payload
      }
    default:
      return state;
  }
};

export default reducer;
