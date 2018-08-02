import { Mongo } from "meteor/mongo";

export const Mafia = new Mongo.Collection("mafia")

Meteor.methods({
    "player.createNew" (name) {
        Mafia.insert({
            name,
            role: 0,
            alive: true,
            player: Meteor.userId()
        })
    }
})

if (Meteor.isServer) {
    AccountsGuest.enabled = true
    AccountsGuest.anonymous = true
  }