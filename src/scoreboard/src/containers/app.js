import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import { startClient } from "websockets";
import { updateGameConfig } from "modules/gameConfig";
import { updateGameState } from "modules/gameState";
import { updateWhoAmI } from "modules/whoAmI";

import Home from "containers/home";
import Admin from "containers/admin";

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
      default:
        console.error("got unknown message from game-controller", { data });
        break;
    }
  }

  return (
    <>
      <Route exact path="/" component={Home} />
      <Route exact path="/admin" component={Admin} />
    </>
  );
};

export default App;
