export const UPDATE_GAME_CONFIG = "GameConfig/UPDATE_GAME_CONFIG";

const initialState = {
  bounds: [0, 0, 0, 0],
  headingOffset: 0,
};

const GameConfig = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GAME_CONFIG:
      return {
        ...action.data,
      };

    default:
      return state;
  }
};

export const updateGameConfig = (newState) => ({
  type: UPDATE_GAME_CONFIG,
  data: newState,
});

export default GameConfig;
