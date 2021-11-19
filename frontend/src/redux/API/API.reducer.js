const {
  REQUEST_PROFILE_API,
  REQUEST_PROFILE_API_SUCCESS,
  REQUEST_PROFILE_API_FAIL,
  ADD_CHILD,
  REMOVE_CHILD,
  ADD_CHILD_REQUEST,
  ADD_CHILD_REQUEST_FAIL,
} = require("./API.types");

const INITIAL_STATE = {
  loading: false,
  children: [],
  averageScoresByGame: [],
  recentScores: [],
  averageOverallScores: [],
  error: "",
  addChildLoading: false
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUEST_PROFILE_API:
      return {
        ...state,
        loading: true,
      };
      break;
    case REQUEST_PROFILE_API_SUCCESS:
      return {
        ...state,
        loading: false,
        children: action.payload.data.childrenArray,
        averageScoresByGame: action.payload.data.averageGameScoreByChild,
        recentScores: action.payload.data.recentScores,
        averageOverallScores: action.payload.data.averageOverallScores,
      };
      break;
    case REQUEST_PROFILE_API_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      break;
    case ADD_CHILD_REQUEST:
      return {
        ...state,
        addChildLoading: true
      }
      break;
    case ADD_CHILD_REQUEST_FAIL:
      return {
        ...state,
        addChildLoading:false,
        error:action.payload
      }
      break;
    case ADD_CHILD:
      return {
        ...state,
        addChildLoading: false,
        children: [...state.children, action.payload],
      };
      break;
    case REMOVE_CHILD:
      return {
        ...state,
        children: state.children.filter((child) => child !== action.payload),
      };
      break;
    default:
      return state;
  }
};
export default reducer;
