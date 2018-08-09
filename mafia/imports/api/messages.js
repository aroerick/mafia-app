import { Mongo } from "meteor/mongo";
import { Mafia } from "./mafia";

if (Meteor.isServer) {
  Meteor.publish("messagesForEveryone", function messagesPublication() {
    return Messages.find({ recipient: "Everyone" });
  });
  Meteor.publish('messagesForRole', function messagesForRolePublication(){
    const currentUser = Mafia.find({ player: Meteor.userId() }).fetch()

    switch(currentUser[0].role) {
      case "mafia": {
        return Messages.find({recipient: "Mafia"})
      }
      case "detective": {
        return Messages.find({recipient: "Detective"})
      }
      case "doctor": {
        return Messages.find({recipient: "Doctor"})
      }
      default: {
        return Messages.find({recipient: "Civilian"})
      }
    }
  })
}
Meteor.methods({
  "messages.handleChatSubmit"(message) {
    //TODO: Allow current user to submit messages for themselvese only
    Messages.insert(message);
  },
})
export const Messages = new Mongo.Collection("messages");
