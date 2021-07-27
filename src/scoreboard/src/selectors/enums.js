export const GAME_STATES = {
  game_over: 0,
  game_on: 1,
  game_paused: 2,
  return_home: 3,
};

export const GAME_STATE_LABELS = [
  "Game Over",
  "Game On!",
  "Game Paused",
  "Returning to Home",
];
export const VALID_GAME_STATES = Object.values(GAME_STATES);

export const BOT_INDEXES = {
  ball_bot: 0,
  player_1: 1,
  player_2: 2,
};
export const VALID_BOT_INDEXES = Object.values(BOT_INDEXES);

export const BOT_MODES = {
  auto: 0,
  manual: 1,
};

export const BOT_MODE_NAMES = ["Autonomous", "Manual"];

export const VALID_BOT_MODES = Object.values(BOT_MODES);
