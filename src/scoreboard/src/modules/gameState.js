export const UPDATE_GAME_STATE = "GameState/UPDATE_GAME_STATE";

const initialState = {
  gameStatus: {
    state: "GAME_OVER",
    secondsRemaining: 0,
  },
  bots: [
    {
      name: "ball-bot",
      x: 0,
      y: 0,
      heading: 0,
    },
    {
      name: "player-1",
      x: 0,
      y: 0,
      heading: 0,
    },
    {
      name: "player-2",
      x: 0,
      y: 0,
      heading: 0,
    },
  ],
  scores: [0, 0],
  isDirty: false,
};

const GameState = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GAME_STATE:
      return {
        ...action.data,
      };

    default:
      return state;
  }
};

export const updateGameState = (newState) => ({
  type: UPDATE_GAME_STATE,
  data: newState,
});

export default GameState;
