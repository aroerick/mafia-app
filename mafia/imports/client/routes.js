import React from "react";
import { Meteor } from "meteor/meteor";
import { Router, Route } from "react-router";
import ReactDOM from "react-dom";
import App from "./../ui/containers/App";
import Victory from './../ui/containers/Victory'
import registerServiceWorker from "./../../client/registerServiceWorker";
import { BrowserRouter } from "react-router-dom";

Meteor.startup(() => {
  ReactDOM.render(
    <BrowserRouter>
      {/* <Router> */}
      <React.Fragment>
        <Route exact path="/" component={App} />
        <Route exact path="/victory" component={Victory}/>
        </React.Fragment>
      {/* </Router> */}
    </BrowserRouter>,
    document.getElementById("root")
  );
  registerServiceWorker();
});
