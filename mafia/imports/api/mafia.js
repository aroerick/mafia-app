import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import shuffledArray from './gamePhase';

export const Mafia = new Mongo.Collection('mafia');

Mafia.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  name: String,
  role: {
    type: String,
    optional: true
  },
  alive: Boolean,
  player: {
    type: String,
    optional: true
  },
  votesForLynch: SimpleSchema.Integer,
  livingPlayer: Boolean,
  targeted: {
    type: Boolean,
    optional: true
  },
  saved: {
    type: Boolean,
    optional: true
  },
  hasActed: {
    type: Boolean,
    optional: true
  }
});

if (Meteor.isServer) {
  AccountsGuest.enabled = true;
  AccountsGuest.anonymous = true;

  Meteor.publish('currentPlayer', function currentPlayerPublication() {
    return Mafia.find({ player: Meteor.userId() });
  });
  Meteor.publish('players', function playersPublication() {
    return Mafia.find({}, { fields: { role: 0 } });
  });
}

const roleArr = [
  'mafia',
  'doctor',
  'detective',
  'mafia',
  'civilian',
  'civilian'
];
// const shuffler = arr => {
//   // Special thanks to CoolAJ86
//   // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
//   let currentIndex = arr.length,
//     temporaryValue,
//     randomIndex;
//   while (0 !== currentIndex) {
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;
//     temporaryValue = arr[currentIndex];
//     arr[currentIndex] = arr[randomIndex];
//     arr[randomIndex] = temporaryValue;
//   }
//   return arr;
// };
// export const ShuffledArray = shuffler(roleArr)

Meteor.methods({
  'player.createNew'(name) {
    const newPlayer = {
      name,
      role: shuffledArray[0],
      // role: roleArr[0],
      alive: true,
      player: Meteor.userId(),
      votesForLynch: 0,
      livingPlayer: true //checks that player is not a bot
    };
    Mafia.schema.validate(newPlayer);
    if (Mafia.find().count() < 6) {
      if (Mafia.find({ name: name }).count() > 0) {
        return {
          joinGameError: true,
          joinError: 'This name has already been used'
        };
      } else {
        Mafia.insert(newPlayer);
        shuffledArray.shift();
        // roleArr.shift();
        console.log(shuffledArray, 'shuffle per char connect');
      }
    } else {
      return { joinGameError: true, joinError: 'Lobby full' };
    }
  },
  'player.setTarget'(villager) {
    Mafia.schema.validate(villager);
    Mafia.update(villager, {
      $set: {
        targeted: true
      }
    });
  },
  'player.setSaved'(villager) {
    Mafia.schema.validate(villager);
    Mafia.update(villager, {
      $set: {
        saved: true
      }
    });
  },
  'player.checkMafia'(villager) {
    Mafia.schema.validate(villager);
    return Mafia.find({ _id: villager._id }, { _id: 0, role: 1 }).fetch();
  },
  'player.setLynchTarget'(villager) {
    Mafia.schema.validate(villager);
    let votesForLynch = villager.votesForLynch;
    votesForLynch++;
    Mafia.update(villager, {
      $set: {
        votesForLynch: votesForLynch
      }
    });
  },
  'player.hasActed'(currentUser) {
    Mafia.schema.validate(currentUser[0]);
    Mafia.update(currentUser[0], {
      $set: {
        hasActed: true
      }
    });
  }
});
