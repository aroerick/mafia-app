import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { GamePhase } from './gamePhase';

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

Meteor.methods({
  'player.createNew'(name) {
    const role = GamePhase.find({ phase: 1 }).fetch()[0].roleArr;
    const newPlayer = {
      name,
      role: role[0],
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
        shiftedRole = role;
        shiftedRole.shift();

        GamePhase.update({ phase: 1 }, { $set: { roleArr: shiftedRole } });

        // roleArr.shift();
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
