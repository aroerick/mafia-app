import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Messages } from './messages';

export const Mafia = new Mongo.Collection('mafia');
export const GamePhase = new Mongo.Collection('gamePhase');

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
  Meteor.publish('gamePhases', function gamePhasesPublication() {
    return GamePhase.find({});
  });
}

let roleArr = ['mafia', 'doctor', 'detective', 'mafia', 'civilian', 'civilian'];
// shuffler = arr => {
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

// let shuffledArray = [];

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
      livingPlayer: true, //checks that player is not a bot,
      hasActed: false
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

        roleArr.shift();
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
    return Mafia.find({ _id: currentUser[0]._id }).fetch();
  },

  'game.resetAll'() {
    Mafia.remove({ livingPlayer: true });
    Mafia.update(
      {},
      {
        $set: { alive: true, votesForLynch: 0, targeted: false, saved: false }
      },
      { multi: true }
    );
    Messages.remove({});
    GamePhase.update(
      { activePhase: true },
      { $set: { activePhase: false } },
      { multi: true }
    );
    GamePhase.update({ phase: 1 }, { $set: { activePhase: true } });
    GamePhase.update({ phase: 6 }, { $set: { winner: '' } });
    let roleArr = [
      'mafia',
      'doctor',
      'detective',
      'mafia',
      'civilian',
      'civilian'
    ];

    // shuffledArray = roleArr;

    // shuffledRoles = shuffler(shuffledArray);
    GamePhase.update(
      { phase: 1 },
      {
        $set: {
          roleArr: roleArr
        }
      }
    );

    GamePhase.update({}, { $set: { feedback: 0 } }, { multi: true });
    // roleArr = ['mafia', 'doctor', 'detective', 'mafia', 'civilian', 'civilian'];
    // shuffledArray = shuffler(roleArr)
    // console.log(shuffledArray)
    // export default shuffledArray
  },
  'game.nextPhase'() {
    GamePhase.update({ phase: 1 }, { $set: { activePhase: false } });
    GamePhase.update({ phase: 2 }, { $set: { activePhase: true } });
    Messages.insert({
      sender: 'Narrator',
      recipient: 'Everyone',
      text: 'Become acquainted.  Do you have enemies or victims?'
    }),
      Meteor.setTimeout(function() {
        GamePhase.update({ phase: 2 }, { $set: { activePhase: false } }),
          GamePhase.update({ phase: 3 }, { $set: { activePhase: true } }),
          Messages.insert({
            sender: 'Narrator',
            recipient: 'Everyone',
            text:
              'The moon has risen.  As the civilians of this township lay their heads to sleep, the doctor, the detective, and the mafia are awakening to finish their tasks'
          }),
          Messages.insert({
            sender: 'Narrator',
            recipient: 'Mafia',
            text: 'Somebody gave you a wicked side eye.  Who was it?'
          }),
          Messages.insert({
            sender: 'Narrator',
            recipient: 'Doctor',
            text:
              'It appears a bug is spreading through the town.  Who shall we check on tonight?'
          }),
          Messages.insert({
            sender: 'Narrator',
            recipient: 'Detective',
            text: 'Somebodys up to no good.  Is it possibly ________?'
          });
      }, 10000);
  },
  'game.updateFeedback'() {
    let phase = GamePhase.find({ phase: 3 }).fetch();
    let feedback = parseInt(phase[0].feedback);
    feedback++;
    GamePhase.update({ phase: 3 }, { $set: { feedback: feedback } });
    //IF WE HAVE RECEIVED ENOUGH FEEDBACK...THEN FIGURE OUT WHOS DYING OR NAH - ONLY IF... I THINK.
    if (
      Mafia.find({
        $and: [{ alive: true }, { role: { $not: { $eq: 'civilian' } } }]
      }).count() <= feedback
    ) {
      GamePhase.update({ phase: 3 }, { $set: { activePhase: false } });
      GamePhase.update({ phase: 4 }, { $set: { activePhase: true } });

      Messages.insert({
        sender: 'Narrator',
        recipient: 'Everyone',
        text:
          'The hustle and bustle of the night has died down.  The dawn is nigh.  On the morning of the new day, a meeting is to be held with the township.'
      });
      Meteor.setTimeout( async function() {
        // Mafia split their vote - nobody dies.  Targeted and saved are reset.
        if (Mafia.find({ targeted: true }).count() > 1) {
          Messages.insert({
            sender: 'Narrator',
            recipient: 'Everyone',
            text: `Lucky for this township, it appears the mafia don't have their act together.  Nobody has died tonight.`
          });
          Mafia.update(
            { targeted: true },
            { $set: { targeted: false } },
            { multi: true }
          );
          Mafia.update({ saved: true }, { $set: { saved: false } });
          Mafia.update(
            { hasActed: true },
            { $set: { hasActed: false } },
            { multi: true }
          );
        }
        // Mafia picked the same villager as the doctor.  Villager lives.  Targeted and saved are reset.
        else if (Mafia.find({ targeted: true }).count() === 1) {
          //IF THE DOCTOR IS ALIVE - THEN CHECK SAVED.
          if (
            Mafia.find({
              $and: [{ role: 'doctor' }, { alive: true }]
            }).count() === 1
          ) {
            targeted = await Mafia.find({ targeted: true }).fetch();
            saved = await Mafia.find({ saved: true }).fetch();

            if (saved[0].name === targeted[0].name) {
              // let villager = Mafia.find({ targeted: true }).fetch();

              Messages.insert({
                sender: 'Narrator',
                recipient: 'Everyone',
                text: `${
                  saved[0].name
                } hosted a party at their place last night... the doctor was there... the mafia was there... nobody was up to any funny business`
              });
              Mafia.update({ targeted: true }, { $set: { targeted: false } });
              Mafia.update({ saved: true }, { $set: { saved: false } });
              Mafia.update(
                { hasActed: true },
                { $set: { hasActed: false } },
                { multi: true }
              );
              // Mafia and doctor visited different people.  The villager visited by the mafia has died.
            } else if (
              Mafia.find({ targeted: true }).fetch() !==
              Mafia.find({ saved: true }).fetch()
            ) {
              targeted = await Mafia.find({ targeted: true }).fetch();

              Messages.insert({
                sender: 'Narrator',
                recipient: 'Everyone',
                text: `We noticed ${
                  targeted[0].name
                } didnt show up to the morning meeting.  There's no trace of them to be found and their home is a wrangled disaster.  What poor misfortune befell our poor ${
                  targeted[0].name
                }??`
              });
              Mafia.update(
                { targeted: true },
                { $set: { alive: false, targeted: false } }
              );
              Mafia.update({ saved: true }, { $set: { saved: false } });
              Mafia.update(
                { hasActed: true },
                { $set: { hasActed: false } },
                { multi: true }
              );
            }
            //IF THE DOCTOR IS DEAD, JUST KILL THE TARGET
          } else {
            targeted = await Mafia.find({ targeted: true }).fetch();

            Messages.insert({
              sender: 'Narrator',
              recipient: 'Everyone',
              text: `We noticed ${
                targeted[0].name
              } didnt show up to the morning meeting.  There's no trace of them to be found and their home is a wrangled disaster.  What poor misfortune befell our poor ${
                targeted[0].name
              }??`
            });
            Mafia.update(
              { targeted: true },
              { $set: { alive: false, targeted: false } }
            );
            Mafia.update({ saved: true }, { $set: { saved: false } });
            Mafia.update(
              { hasActed: true },
              { $set: { hasActed: false } },
              { multi: true }
            );
          }
        }
        //ALL PEOPLE DEAD OR ALIVE NOW. DID ANYONE WIN?
        //VILLAGER WIN
        if (
          Mafia.find({ $and: [{ role: 'mafia' }, { alive: true }] }).count() ===
          0
        ) {
          GamePhase.update({ phase: 5 }, { $set: { activePhase: false } });
          GamePhase.update(
            { phase: 6 },
            { $set: { winner: 'villagers', activePhase: true } }
          );
          Messages.insert({
            sender: 'Narrator',
            recipient: 'Everyone',
            text: `Good job township.  Y'all have successfully saved yourselves from the mafia.  No mafia remain.`
          });
          //MAFIA WIN
        } else if (
          Mafia.find({ $and: [{ role: 'mafia' }, { alive: true }] }).count() >=
            Mafia.find({
              $and: [{ role: { $not: /mafia/ } }, { alive: true }]
            }).count() &&
          Mafia.find({
            $and: [{ role: { $not: /mafia/ } }, { alive: true }]
          }).count() < 2
        ) {
          GamePhase.update({ phase: 5 }, { $set: { activePhase: false } });
          GamePhase.update(
            { phase: 6 },
            { $set: { winner: 'mafia', activePhase: true } }
          );
          Messages.insert({
            sender: 'Narrator',
            recipient: 'Everyone',
            text: `Good job mafia.  You own this town.  Mafia outnumber the villagers.`
          });
          //IF NOBODY WINS. PROOCED BACK TO PHASE 5 - DAY LYNCHING
        } else {
          GamePhase.update({ phase: 3 }, { $set: { feedback: 0 } });
          GamePhase.update({ phase: 4 }, { $set: { activePhase: false } });
          GamePhase.update({ phase: 5 }, { $set: { activePhase: true } });
          Mafia.update(
            { hasActed: true },
            { $set: { hasActed: false } },
            { multi: true }
          );

          Messages.insert({
            sender: 'Narrator',
            recipient: 'Everyone',
            text: `The town still feels strange.  Somebody is here who's looking to start trouble.  Perhaps we should get rid of them?  What say the town people?`
          });
        }
      }, 10000);
    }
  },

  'game.updateDaytimeFeedback'() {
    let phase = GamePhase.find({ phase: 5 }).fetch();
    let feedback = parseInt(phase[0].feedback);
    feedback++;
    GamePhase.update({ phase: 5 }, { $set: { feedback: feedback } });
    if (
      Mafia.find({
        $and: [{ alive: true }, { livingPlayer: { $eq: true } }]
      }).count() <= feedback
    ) {
      let lynchedPlayer = Mafia.findOne({}, { sort: { votesForLynch: -1 } });
      if (lynchedPlayer.votesForLynch > feedback / 2) {
        Messages.insert({
          sender: 'Narrator',
          recipient: 'Everyone',
          text: `For the good of the town, ${
            lynchedPlayer.name
          } has been lynched`
        });
        Mafia.update({ name: lynchedPlayer.name }, { $set: { alive: false } });
        Mafia.update(
          { hasActed: true },
          { $set: { hasActed: false } },
          { multi: true }
        );
        Mafia.update({}, { $set: { votesForLynch: 0 } }, { multi: true });
      } //TODO - deal with situation where 2 people have split votes
      else {
        Messages.insert({
          sender: 'Narrator',
          recipient: 'Everyone',
          text: `There was too much indecision.  Nobody was lynched.  Another night shall fall.  The mafia are still amongst us.`
        });
        Mafia.update(
          { hasActed: true },
          { $set: { hasActed: false } },
          { multi: true }
        );
        Mafia.update({}, { $set: { votesForLynch: 0 } }, { multi: true });
      }
      //check for wins
      if (
        Mafia.find({ $and: [{ role: 'mafia' }, { alive: true }] }).count() === 0
      ) {
        GamePhase.update({ phase: 5 }, { $set: { activePhase: false } });

        GamePhase.update(
          { phase: 6 },
          { $set: { activePhase: true, winner: 'villagers' } }
        );
        Messages.insert({
          sender: 'Narrator',
          recipient: 'Everyone',
          text: `Good job township.  Y'all have successfully saved yourselves from the mafia.  No mafia remain.`
        });
      } else if (
        Mafia.find({ $and: [{ role: 'mafia' }, { alive: true }] }).count() >=
          Mafia.find({
            $and: [{ role: { $not: /mafia/ } }, { alive: true }]
          }).count() &&
        Mafia.find({
          $and: [{ role: { $not: /mafia/ } }, { alive: true }]
        }).count() < 2
      ) {
        GamePhase.update({ phase: 5 }, { $set: { activePhase: false } });
        GamePhase.update(
          { phase: 6 },
          { $set: { activePhase: true, winner: 'mafia' } }
        );

        Messages.insert({
          sender: 'Narrator',
          recipient: 'Everyone',
          text:
            'Good job mafia.  You own this town.  Mafia outnumber the villagers.'
        });
        //CHECK FOR THE WIN.  IF NO WIN. PROCEED TO RUN DAY TIME STUFF
      } else {
        GamePhase.update({ phase: 5 }, { $set: { feedback: 0 } });
        GamePhase.update({ phase: 5 }, { $set: { activePhase: false } }),
          GamePhase.update({ phase: 3 }, { $set: { activePhase: true } }),
          Mafia.update(
            { hasActed: true },
            { $set: { hasActed: false } },
            { multi: true }
          );
        Messages.insert({
          sender: 'Narrator',
          recipient: 'Everyone',
          text:
            'The moon has risen.  As the civilians of this township lay their heads to sleep, the doctor, the detective, and the mafia are awakening to finish their tasks.'
        }),
          Messages.insert({
            sender: 'Narrator',
            recipient: 'Mafia',
            text: `I can't believe the township are out to get us.  Maybe we should show them whos boss.`
          }),
          Messages.insert({
            sender: 'Narrator',
            recipient: 'Doctor',
            text:
              'Heard somebody coughing in the night.  Pick someone to visit.'
          }),
          Messages.insert({
            sender: 'Narrator',
            recipient: 'Detective',
            text: 'Something fishy is going on.  Who seems suspicious?'
          });
      }
    }
  }
});
