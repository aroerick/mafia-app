import { Meteor } from "meteor/meteor";
import { Mafia } from "../../api/mafia";

Meteor.startup(() => {
  if (Mafia.find().count() === 0) {
    Mafia.insert({
      name: 'Pam',
      role: 'mafia',
      alive: true
    },
    {
      name: 'Jon',
      role: 'mafia',
      alive: true
    },
    {
      name: 'Adam',
      role: 'detective',
      alive: true
    },
    {
      name: 'Effat',
      role: 'doctor',
      alive: true
    },
    {
      name: 'Bob',
      role: 'civilian',
      alive: true
    },
    {
      name: 'Sue',
      role: 'civilian',
      alive: true
    });
  }
});
