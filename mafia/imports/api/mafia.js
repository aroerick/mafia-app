import { Mongo } from "meteor/mongo";

export const Mafia = new Mongo.Collection("mafia")
const roleArr = ['mafia', 'civilian', 'detective', 'ciivlian', 'doctor', 'mafia']

Meteor.methods({
    "player.createNew" (name) {
        if(Mafia.find().count() < 6) {
            Mafia.insert({
                name,
                role: roleArr[0],
                alive: true,
                player: Meteor.userId()
            })
            roleArr.shift()
        } else {
            console.log('Lobby full')
        }
    }
})

if (Meteor.isServer) {
    AccountsGuest.enabled = true
    AccountsGuest.anonymous = true
  }