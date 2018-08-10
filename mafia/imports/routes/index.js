import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Redirect, Route, Switch } from 'react-router';
import Game from '../pages/Game';
import Victory from '../pages/Victory';

export default () => (
  <div>
    <Switch>
      <Route exact path="/" component={Game} />
      <Route exact path="/victory" component={Victory} />
      <Redirect to="/" />
    </Switch>
  </div>
);
