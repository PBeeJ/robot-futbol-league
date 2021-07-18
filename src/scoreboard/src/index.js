import React from "react";

import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import "fontsource-roboto";

import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import store, { history } from "./store";

import App from "./containers/app";

import "sanitize.css/sanitize.css";
import "./index.css";

const theme = createTheme({});

const target = document.querySelector("#root");

render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>
          <App />
        </div>
      </ConnectedRouter>
    </Provider>
  </ThemeProvider>,
  target
);
