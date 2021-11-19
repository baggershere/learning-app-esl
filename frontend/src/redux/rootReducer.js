import { combineReducers } from "redux";

import userReducer from "./user/user.reducer"
import signupReducer from "./signup/signup.reducer"
import profileReducer from "./API/API.reducer"

const rootReducer = combineReducers({
  user: userReducer,
  signup: signupReducer,
  profile: profileReducer
});

export default rootReducer;
