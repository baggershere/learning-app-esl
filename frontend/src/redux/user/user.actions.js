import {
  REQUEST_LOGIN,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_FAILED,
  SET_USER_STATE,
  FETCH_INITIAL_STATE,
  FETCH_INITIAL_STATE_SUCCESS,
  FETCH_INITIAL_STATE_FAIL,
  RESET_USER_STATE,
  RESET_SELECTED_CHILD,
  SET_SELECTED_CHILD,
  SWITCH_LANGUAGE,
} from "./user.types";
import axios from "axios";
import { useDispatch } from "react-redux";
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: REQUEST_LOGIN });
    const resp = await axios.post(
      process.env.NODE_ENV === "production"
        ? "https://esl-complete-app.herokuapp.com/api/login"
        : "http://localhost:5000/api/login",
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    const user = resp.data.user;
    console.log(user.token); // set token cookie
    dispatch({ type: REQUEST_LOGIN_SUCCESS, payload: user });
  } catch (e) {
    console.log(e.response);
    dispatch({ type: REQUEST_LOGIN_FAILED, payload: e.response.data.message });
  }
};

export const setUserState = (jwt) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_INITIAL_STATE });
    const resp = await axios.post(
      "https://esl-games-backend.herokuapp.com/api/fetchuserinfo",
      {
        withCredentials: true,
      }
    );
    console.log(resp.data);
    dispatch({ type: FETCH_INITIAL_STATE_SUCCESS, payload: resp.data });
  } catch (error) {
    dispatch({ type: FETCH_INITIAL_STATE_FAIL, payload: error.response });
  }
};

export const resetUserState = () => (dispatch) => {
  dispatch({ type: RESET_USER_STATE });
};

export const resetSelectedChild = () => (dispatch, getState) => {
  const children = getState().profile.children;
  dispatch({
    type: RESET_SELECTED_CHILD,
    payload: children.length > 0 ? children[0] : "",
  });
};

export const switchLanguage = () => (dispatch, getState) => {
  const newLanguage =
    getState().user.language === "English" ? "Chinese" : "English";
  dispatch({ type: SWITCH_LANGUAGE, payload: newLanguage });
};
