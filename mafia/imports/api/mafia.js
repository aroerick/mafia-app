import { Mongo } from "meteor/mongo";

export const Mafia = new Mongo.Collection("mafia");
export const GamePhase = new Mongo.Collection("gamePhase");
export const Messages = new Mongo.Collection("messages");

const roleArr = [
  "mafia",
  "doctor",
  "detective",
  "ciivlian",
  "civilian",
  "mafia"
];

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
  }
});

if (Meteor.isServer) {
  AccountsGuest.enabled = true;
  AccountsGuest.anonymous = true;
}
