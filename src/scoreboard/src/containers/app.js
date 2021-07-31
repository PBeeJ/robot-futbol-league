import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import { startClient } from "../websockets";
import { updateGameConfig } from "../modules/gameConfig";
import { updateGameState } from "../modules/gameState";
import { updateVideoState } from "../modules/videoState";
import { updateWhoAmI } from "../modules/whoAmI";

import Home from "./home";
import Admin from "./admin";
import ManualControls from "./manualControls";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    startClient(handleWsMessage);
  }, []);

  function handleWsMessage({ type, data }) {
    switch (type) {
      case "state":
        dispatch(updateGameState(data));
        break;
      case "config":
        dispatch(updateGameConfig(data));
        break;
      case "iseeu":
        dispatch(updateWhoAmI(data));
        break;
      case "playVideo":
        dispatch(updateVideoState(data));
        break;
      default:
        console.error("got unknown message from game-controller", type, { data });
        break;
    }
  }

  return (
    <>
      <Route exact path="/" component={Home} />
      <Route exact path="/admin" component={Admin} />
      <Route path="/play" component={ManualControls} />
    </>
  );
};

export default App;
