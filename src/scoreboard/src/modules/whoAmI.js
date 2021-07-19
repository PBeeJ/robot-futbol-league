export const UPDATE_WHOAMI = "WhoAmI/UPDATE_WHO_AM_I";

const initialState = {
  ip: null,
  isAdmin: null,
  knownBot: null,
};

const WhoAmI = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_WHOAMI:
      return action.data;

    default:
      return state;
  }
};

export const updateWhoAmI = (newState) => ({
  type: UPDATE_WHOAMI,
  data: newState,
});

export default WhoAmI;
