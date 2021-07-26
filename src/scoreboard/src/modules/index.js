import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import gameState from "./gameState";
import gameConfig from "./gameConfig";
import whoAmI from "./whoAmI";

const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  gameState,
  gameConfig,
  whoAmI,
});

export default rootReducer;
