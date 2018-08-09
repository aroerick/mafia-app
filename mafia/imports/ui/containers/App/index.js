import React, { Component } from "react";
import { Mafia } from "../../../api/mafia";
import { Messages } from "../../../api/messages"
import { GamePhase } from "../../../api/gamePhase"
import { withTracker } from "meteor/react-meteor-data";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "../../../routes";

class App extends Component {
  render() {
    return (
      <Router>
        <Routes />
      </Router>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('currentPlayer');
  Meteor.subscribe('gamePhases');
  Meteor.subscribe('players');
  Meteor.subscribe('messagesForEveryone')
  Meteor.subscribe('messagesForRole')

  return {
    township: Mafia.find().fetch(),
    messages: Messages.find().fetch(),
    currentUserId: Meteor.userId(),
    currentUser: Mafia.find({ player: Meteor.userId() }).fetch(),
    gamePhase: GamePhase.find().fetch()
  };
})(App);
