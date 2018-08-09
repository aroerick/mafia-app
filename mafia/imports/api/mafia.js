import { Mongo } from "meteor/mongo";

export const Mafia = new Mongo.Collection("mafia");

if (Meteor.isServer){
  AccountsGuest.enabled = true;
  AccountsGuest.anonymous = true;

  Meteor.publish('currentPlayer', function currentPlayerPublication(){
    return Mafia.find({player: Meteor.userId() })
  })
  Meteor.publish('players', function playersPublication(){
    return Mafia.find({})
    // ,{fields: {role: 1, votesForLynch:0} }
  })
}

let roleArr = [
  "mafia",
  "doctor",
  "detective",
  "mafia",
  "civilian",
  "civilian"
];
const shuffler = (arr) => {
  // Special thanks to CoolAJ86
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  let currentIndex = arr.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }
  return arr;
}
Meteor.methods({
  "player.createNew"(name) {
    if (Mafia.find().count() < 6) {
      Mafia.insert({
        name,
        role: roleArr[0],
        alive: true,
        player: Meteor.userId(),
        votesForLynch: 0,
        livingPlayer: true //checks that player is not a bot
      });
      roleArr.shift();
    } else {
      console.log("Lobby full");
    }
  },
  "player.setTarget"(villager) {
    Mafia.update(villager, {
      $set: {
        targeted: true
      }
    });
  },
  "player.setSaved"(villager) {
    Mafia.update(villager, {
      $set: {
        saved: true
      }
    });
  },
  "player.investigate"(villager) {
    const inv = Mafia.find({ _id: villager }, { _id: 0, role: 1 }).fetch();
  },
  "player.setLynchTarget"(villager) {
    let votesForLynch = villager.votesForLynch;
    votesForLynch++;
    Mafia.update(villager, {
      $set: {
        votesForLynch: votesForLynch
      }
    });
  },
  "player.hasActed"(currentUser) {
    Mafia.update(currentUser[0], {
      $set: {
        hasActed: true
      }
    });
  }
});
