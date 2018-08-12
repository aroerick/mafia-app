import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mafia } from '../../api/mafia';
import { GamePhase } from '../../api/mafia';
import { Button, Header } from 'semantic-ui-react';
class Victory extends Component {
  reset = () => {
    Meteor.call('game.resetAll');
    Meteor.call('messages.handleChatSubmit', {
      sender: 'Narrator',
      recipient: 'Everyone',
      text:
        'An unsettling energy stirs in the township.  There are rumours the mafia will visit an unlucky villager tonight.'
    });
    this.setState({ mafiaChatActive: false });
  };

  render() {
    const { gamePhase, currentUser } = this.props;
    return (
      <div>
        {/* <div>{currentUser[0] ? currentUser[0].name : ''}</div> */}
        {gamePhase[5] && gamePhase[5].winner === 'villagers' ? (
          <Header as="h1" block>
            Villagers Win!
          </Header>
        ) : (
          <Header as="h1" block>
            Mafia Win!
          </Header>
        )}
        <Button
          type="submit"
          color="red"
          onClick={this.reset}
          content="Play Again"
        />
      </div>
    );
  }
}
export default withTracker(() => {
  return {
    //   currentUserId: Meteor.userId(),
    currentUser: Mafia.find({ player: Meteor.userId() }).fetch(),
    gamePhase: GamePhase.find().fetch()
  };
})(Victory);
