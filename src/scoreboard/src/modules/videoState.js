export const UPDATE_VIDEO_STATE = "VideoState/UPDATE_VIDEO_STATE";

const initialState = {
  videoPlaying: null,
};

const VideoState = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_VIDEO_STATE:
      return {
        ...action.data,
      };

    default:
      return state;
  }
};

export const updateVideoState = (newState) => ({
  type: UPDATE_VIDEO_STATE,
  data: newState,
});

export default VideoState;
