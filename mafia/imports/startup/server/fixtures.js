import { Meteor } from "meteor/meteor";
import { Mafia } from "../../api/mafia";

Meteor.startup(() => {
  if (Mafia.find().count() === 0) {
    Mafia.insert({
      name: 'Pam',
      role: 'mafia',
      alive: true
    }),
    Mafia.insert({
      name: 'Jon',
      role: 'mafia',
      alive: true
    }),
    Mafia.insert({
      name: 'Adam',
      role: 'detective',
      alive: true
    }),
    Mafia.insert({
      name: 'Effat',
      role: 'doctor',
      alive: true
    }),
    Mafia.insert({
      name: 'Bob',
      role: 'civilian',
      alive: true
    }),
    Mafia.insert({
      name: 'Sue',
      role: 'civilian',
      alive: true
    });
  }
});
