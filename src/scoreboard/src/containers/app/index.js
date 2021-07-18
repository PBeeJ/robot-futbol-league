import React, { useEffect } from "react";
import { Route, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { startClient } from "websockets";
import { updateGameConfig } from "modules/gameConfig";
import { updateGameState } from "modules/gameState";

import Home from "../home";
import About from "../about";

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
      default:
        console.error("got unknown message from game-controller", { data });
        break;
    }
  }

  return (
    <div>
      <header>
        <Link to="/">Home</Link>
        <Link to="/about-us">About</Link>
      </header>

      <main>
        <Route exact path="/" component={Home} />
        <Route exact path="/about-us" component={About} />
      </main>
    </div>
  );
};

export default App;
