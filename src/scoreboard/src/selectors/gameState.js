import { createSelector } from "reselect";
import { BOT_MODES } from "./enums";

export const gameStateStateSelector = (state) => state.gameState.gameStatus.state;
export const secondsRemainingSelector = (state) => state.gameState.gameStatus.secondsRemaining;
export const botsSelector = (state) => state.gameState.bots;
export const scoresSelector = (state) => state.gameState.scores;

export const botModesSelector = createSelector(botsSelector, (bots) => bots.map((bot) => bot.mode));

export const hasManualBotSelector = createSelector(
  botModesSelector,
  (botModes) => botModes.includes(BOT_MODES.manual),
);
