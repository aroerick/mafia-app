import { Mongo } from "meteor/mongo";

export const Mafia = new Mongo.Collection("mafia")

Meteor.methods({
    "player.createNew" (name) {
        if(Mafia.find().count() < 6) {
            Mafia.insert({
                name,
                role: 0,
                alive: true,
                player: Meteor.userId()
            })
        } else {
            console.log('Lobby full')
        }
    }
})

if (Meteor.isServer) {
    AccountsGuest.enabled = true
    AccountsGuest.anonymous = true
  }