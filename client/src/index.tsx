import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import "./scss/index.scss";
import App from "./App";
import store from "./store/store";

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById("app"),
);
