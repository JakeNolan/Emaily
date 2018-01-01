import "materialize-css/dist/css/materialize.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";

import App from "./components/App";
import reducers from "./reducers";

// !! badass way to test endpoints in chrome console in dev mode
// make sure we have acess to axios by running: axios in chrome console
// then make request ex> axios.get('/api/surveys) 
// check out results in network tab.. click res.. preview
import axios from "axios";
window.axios = axios;

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

// 2nd ref we have to provide an existing html thing
ReactDOM.render(
  // Provider is a react component that updates all of its children anytime the store changes
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
