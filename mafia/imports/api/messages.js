import { Mongo } from "meteor/mongo";

Meteor.methods({
    "messages.handleChatSubmit"(message){
      Messages.insert(message)  
    }
})
export const Messages = new Mongo.Collection("messages")