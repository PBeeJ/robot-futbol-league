import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import gameState from "./gameState";
import gameConfig from "./gameConfig";

const rootReducer = (history) => {
  return combineReducers({
    router: connectRouter(history),
    gameState,
    gameConfig,
  });
};

export default rootReducer;
