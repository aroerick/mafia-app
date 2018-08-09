import { Meteor } from "meteor/meteor";
import { Mafia } from "../../api/mafia";
import { Messages } from "../../api/messages";
import { GamePhase } from "../../api/gamePhase";

Meteor.startup(() => {
  if (Mafia.find().count() === 0) {
    Mafia.insert({
      name: "Testing Tina",
      role: "civilian",
      alive: false,
      votesForLynch: 0,
      livingPlayer: false
    });
    Mafia.insert({
      name: "Testing Timothy",
      role: "civilian",
      alive: true,
      votesForLynch: 0,
      livingPlayer: false
    });
    // Mafia.insert({
    //   name: 'Testing Tabitha',
    //   role: 'mafia',
    //   alive: true
    // })
  }

  if (Messages.find().count() === 0) {
    Messages.insert({
      sender: "Narrator",
      recipient: "Everyone",
      text:
        "An unsettling energy stirs in the township.  There are rumours the mafia will visit an unlucky villager tonight."
    });
  }

  if (GamePhase.find().count() === 0) {
    GamePhase.insert({
      phase: 1,
      title: "Lobby",
      activePhase: true
    });
    GamePhase.insert({
      phase: 2,
      title: "Meet the township",
      activePhase: false
    });

    GamePhase.insert({
      phase: 3,
      title: "Night falls",
      activePhase: false,
      feedback: 0
    });
    GamePhase.insert({
      phase: 4,
      title: "The new day dawns",
      activePhase: false
    });
    GamePhase.insert({
      phase: 5,
      title: "Town Lynching",
      activePhase: false,
      feedback: 0
    });

    GamePhase.insert({
      phase: 6,
      title: "Victory",
      activePhase: false,
      feedback: 0,
      winner: ""
    });
  }
});
