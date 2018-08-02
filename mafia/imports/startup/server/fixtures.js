import { Meteor } from "meteor/meteor";
import { Mafia } from "../../api/mafia";
import { Messages } from '../../api/messages'

Meteor.startup(() => {
  if (Mafia.find().count() === 0) {
    Mafia.insert({
      name: 'Testing Tom',
      role: 'mafia',
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
