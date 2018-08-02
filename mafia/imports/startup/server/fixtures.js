import { Meteor } from "meteor/meteor";
import { Mafia } from "../../api/mafia";
import { Messages } from '../../api/messages'

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
    })
  }

  if (Messages.find().count() === 0) {
    Messages.insert({
      sender: 'Narrator',
      recipient: 'Everyone',
      text: 'The night is young.  There are no sound sleepers.'
    })
  }
});
