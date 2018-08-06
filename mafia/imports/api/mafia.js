import { Mongo } from "meteor/mongo";

export const Mafia = new Mongo.Collection("mafia");
export const GamePhase = new Mongo.Collection("gamePhase");
export const Messages = new Mongo.Collection("messages");

const roleArr = [
  "mafia",
  "doctor",
  "detective",
  "mafia",
  "ciivlian",
  "civilian",
  
];

const targetedVillager = Mafia.find({targeted: true})
const savedVillager = Mafia.find({saved:true})

Meteor.methods({
  "player.createNew"(name) {
    if (Mafia.find().count() < 6) {
      Mafia.insert({
        name,
        role: roleArr[0],
        alive: true,
        player: Meteor.userId()
      });
      roleArr.shift();
    } else {
      console.log("Lobby full");
    }
  },
  "game.nextPhase"() {
    GamePhase.update({ phase: 1 }, { $set: { activePhase: false } });
    GamePhase.update({ phase: 2 }, { $set: { activePhase: true } });
    Messages.insert({
      sender: "Narrator",
      recipient: "Everyone",
      text: "Become acquainted.  Do you have enemies or victims?"
    }),
      Meteor.setTimeout(function() {
        GamePhase.update({ phase: 2 }, { $set: { activePhase: false } }),
          GamePhase.update({ phase: 3 }, { $set: { activePhase: true } }),
          Messages.insert({
            sender: "Narrator",
            recipient: "Everyone",
            text:
              "The moon has risen.  As the civilians of this township lay their heads to sleep, the doctor, the detective, and the mafia are awakening to finish their tasks"
          }),
          Messages.insert({
            sender: "Narrator",
            recipient: "Mafia",
            text: "Somebody gave you a wicked side eye.  Who was it?"
          }),
          Messages.insert({
            sender: "Narrator",
            recipient: "Doctor",
            text:
              "It appears a bug is spreading through the town.  Who shall we check on tonight?"
          }),
          Messages.insert({
            sender: "Narrator",
            recipient: "Detective",
            text: "Somebodys up to no good.  Is it possibly ________?"
          });
      }, 10000);
  },
  "messages.handleChatSubmit"(message) {
    Messages.insert(message);
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
    const inv = Mafia.find({ _id: villager }, {_id: 0, role: 1}).fetch()
    // console.log(inv)
  },
  "game.updateFeedback"(){
      let phase = GamePhase.find({phase:3}).fetch()
      let feedback = parseInt(phase[0].feedback)
      feedback++
      GamePhase.update({phase: 3}, {$set:{feedback: feedback}})

      if (Mafia.find({ $and: [ { alive: true }, { role: { $not: { $eq: "civilian" } } } ] }).count() === feedback){
        GamePhase.update({ phase: 3 }, { $set: { activePhase: false } });
        GamePhase.update({ phase: 4 }, { $set: { activePhase: true } });

        Messages.insert({
          sender: "Narrator",
          recipient: "Everyone",
          text:
            "The hustle and bustle of the night has died down.  The dawn is nigh.  On the morning of the new day, a meeting is to be held with the township."
        })

        // Mafia split their vote - nobody dies.  Targeted and saved are reset.
        if (Mafia.find({targeted:true}).count()>1){
          Messages.insert({
            sender: "Narrator",
            recipient: "Everyone",
            text:
              "Lucky for this township, it appears the mafia don't have their act together.  Nobody has died tonight."
          })
          Mafia.update({targeted:true}, {
            $set: {
              targeted:false
            }
          });
          Mafia.update({targeted:true}, {
            $set: {
              targeted:false
            }
          });
          Mafia.update({saved:true}, {
            $set: {
              saved:false
            }
          });
        } 
        // Mafia picked the same villager as the doctor.  Villager lives.  Targeted and saved are reset.  
        else if (Mafia.find({targeted:true}).count() === 1){
          let targeted = Mafia.find({targeted:true}).fetch()
          let saved = Mafia.find({saved:true}).fetch()
          if (saved[0].name === targeted[0].name){
            let villager = Mafia.find({targeted:true}).fetch()

            Messages.insert({
              sender: "Narrator",
              recipient: "Everyone",
              text: `${saved} hosted a party at their place last night... the doctor was there... the mafia was there... nobody was up to any funny business`
            }) 
            Mafia.update({targeted:true}, {
              $set: {
                targeted:false
              }
            });
            Mafia.update({saved:true}, {
              $set: {
                saved:false
              }
            });
      

            // Mafia and doctor visited different people.  The villager visited by the mafia has died.
          } else if (Mafia.find({targeted:true}).fetch()!== Mafia.find({saved:true}).fetch()){
            let targeted = Mafia.find({targeted:true}).fetch()

            Messages.insert({
              sender: "Narrator",
              recipient: "Everyone",
              text:`We noticed ${targeted[0].name} didnt show up to the morning meeting.  There's no trace of them to be found and their home is a wrangled disaster.  What poor misfortune befell our poor ${targeted[0].name}??`

                // `${villager[0].name}'s home appears to have been wrangled in the night.  No trace of them to be found!`
            }) 

            Mafia.update({targeted:true}, {
              $set: {
                alive: false
              }
            });

            Mafia.update({saved:true}, {
              $set: {
                saved:false
              }
            });

          }

        }

        GamePhase.update({phase: 3}, {$set:{feedback: 0}})
      }

  },
  "player.hasActed"(currentUser) {
    Mafia.update(currentUser[0], {
      $set: {
        hasActed: true
      }
    });
  }
});

if (Meteor.isServer) {
  AccountsGuest.enabled = true;
  AccountsGuest.anonymous = true;
}
