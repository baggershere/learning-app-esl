import axios from "axios";
import { SET_SELECTED_CHILD } from "../user/user.types";
import {
  ADD_CHILD,
  ADD_CHILD_REQUEST,
  ADD_CHILD_REQUEST_FAIL,
  REMOVE_CHILD,
  REQUEST_PROFILE_API,
  REQUEST_PROFILE_API_FAIL,
  REQUEST_PROFILE_API_SUCCESS,
} from "./API.types";
import moment from "moment";

export const fetchProfileInfo = () => async (dispatch, getState) => {
  try {
    dispatch({ type: REQUEST_PROFILE_API });
    const { data } = await axios.post(
      process.env.NODE_ENV == "production"
        ? "https://esl-complete-app.com/api/fetchprofileinfo"
        : "http://localhost:5000/api/fetchprofileinfo",
      { withCredentials: true }
    );
    const selectedChild = getState().user.selectedChild;

    if (!data.data.childrenArray.includes(selectedChild)) {
      const newSelectedChild =
        data.data.childrenArray.length > 0 ? data.data.childrenArray[0] : "";
      dispatch({ type: SET_SELECTED_CHILD, payload: newSelectedChild });
    }

    dispatch({ type: REQUEST_PROFILE_API_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: REQUEST_PROFILE_API_FAIL, payload: error.response });
  }
};

export const addChild = (name) => async (dispatch) => {
  try {
    dispatch({ type: ADD_CHILD_REQUEST });
    await axios.post(
      process.env.NODE_ENV === "production"
        ? "https://esl-complete-app.com/api/addchild"
        : "http://localhost:5000/api/addchild",
      { childName: name },
      { withCredentials: true }
    );
    dispatch({ type: ADD_CHILD, payload: name });
  } catch (error) {
    console.log(error);
    console.log(error.response.data.error.name);
    dispatch({
      type: ADD_CHILD_REQUEST_FAIL,
      payload: error.response.data.error.name,
    });
  }
};

export const removeChild = (name) => async (dispatch) => {
  dispatch({ type: REMOVE_CHILD, payload: name });
  await axios.post(
    "https://esl-games-backend.herokuapp.com/api/removechild",
    { childName: name },
    { withCredentials: true }
  );
};

export const addScores = (score, game) => async (dispatch, getState) => {
  const selectedChild = getState().user.selectedChild;
  const email = getState().user.email;
  console.log(score, game, selectedChild, email);

  await axios.post(
    "https://esl-games-backend.herokuapp.com/api/submitgamescore",
    {
      childName: selectedChild,
      gameName: game,
      gameScore: Math.round(score),
      email: email,
      time: moment().format("YYYY-MM-DD HH:mm:ss"),
    },
    { withCredentials: true }
  );
};
