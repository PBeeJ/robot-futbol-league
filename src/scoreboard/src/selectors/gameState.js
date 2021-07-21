// import { createSelector } from "reselect";
// import { GAME_STATES } from "./enums";

export const gameStateStateSelector = (state) =>
  state.gameState.gameStatus.state;
export const secondsRemainingSelector = (state) =>
  state.gameState.gameStatus.secondsRemaining;
