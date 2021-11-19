import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./rootReducer";
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const initialState ={}
const store = createStore(rootReducer, initialState, composeEnhancer(applyMiddleware(thunk)));

export default store;
