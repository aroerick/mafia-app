import { Mongo } from "meteor/mongo";

export const Mafia = new Mongo.Collection("mafia")

if (Meteor.isServer) {
    AccountsGuest.enabled = true
    AccountsGuest.anonymous = true
  }