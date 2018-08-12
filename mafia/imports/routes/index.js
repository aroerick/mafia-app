import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Redirect, Route, Switch } from 'react-router';
import Game from '../pages/Game';
import Victory from '../pages/Victory';
import Start from '../pages/Start';

export default ({ gamePhase }) => {
  if (gamePhase.length >= 7 && gamePhase[5].activePhase) {
    return (
      <Switch>
        <Route exact path="/victory" component={Victory} />
        <Redirect to="/victory" />
      </Switch>
    );
  } else if (gamePhase.length >= 7 && gamePhase[6].activePhase) {
    return (
      <Switch>
        <Route exact path="/start" component={Start} />
        <Redirect to="/start" />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route exact path="/" component={Game} />
        <Redirect to="/" />
      </Switch>
    );
  }
};
