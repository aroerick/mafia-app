import { Mongo } from "meteor/mongo";
import { Mafia } from "./mafia";
import SimpleSchema from "simpl-schema";

export const Messages = new Mongo.Collection("messages");

Messages.schema = new SimpleSchema({
  _id: { 
    type: String,
    optional: true
  },
  sender: String,
  recipient: String,
  text: String
});

if (Meteor.isServer) {
  Meteor.publish("messagesForEveryone", function messagesPublication() {
    return Messages.find({ recipient: "Everyone" });
  });
  Meteor.publish("messagesForRole", function messagesForRolePublication() {
    const currentUser = Mafia.find({ player: Meteor.userId() }).fetch();

    switch (currentUser[0].role) {
      case "mafia": {
        return Messages.find({ recipient: "Mafia" });
      }
      case "detective": {
        return Messages.find({ recipient: "Detective" });
      }
      case "doctor": {
        return Messages.find({ recipient: "Doctor" });
      }
      default: {
        return Messages.find({ recipient: "Civilian" });
      }
    }
  });
  Meteor.publish("messagesForPlayer", function messagesForPlayerPublication() {
    const currentUser = Mafia.find({ player: Meteor.userId() }).fetch();
    return Messages.find({ recipient: currentUser[0].name });
  });
}
Meteor.methods({
  "messages.handleChatSubmit"(message) {
    Messages.schema.validate(message);
    //TODO: Allow current user to submit messages for themselvese only
    Messages.insert(message);
  }
});
