import React from "react";
import { Meteor } from "meteor/meteor";
import ReactDOM from "react-dom";
import registerServiceWorker from './registerServiceWorker'
import "./main.css";
import "./main.html";

import "../imports/routes";

import App from "../imports/ui/containers/App";

Meteor.startup(() => {
  ReactDOM.render(<App />, document.getElementById("root"));
  registerServiceWorker();
});
