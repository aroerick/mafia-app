import React, { Component } from 'react';
import './styles.css';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Mafia } from '../../api/mafia';
import { Messages } from '../../api/messages';
import { GamePhase } from '../../api/mafia';

import { Button, Header, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Start extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.playerName = React.createRef();
    this.state = {
      mafiaChatActive: false,
      activeAccordion: 0,
      joinGameError: false,
      joinError: ''
    };
  }
  // componentDidUpdate(prevProps, prevState){
  // 	prevProps.gamePhase && prevProps.gamePhase[3].activePhase ?
  // 	this.setState({ activeAccordion: 1 }) : null
  // }
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
    const {
      township,
      currentUserId,
      messages,
      gamePhase,
      currentUser
    } = this.props;
    const { activeAccordion } = this.state;

    return (
      <Container>
        <div
          className="ui grid middle aligned centered"
          style={{ height: '100vh' }}
        >
          <div className="one column row centered">
            <h2 className="ui icon center aligned header">
              <i aria-hidden="true" className="users circular icon" />
            </h2>
            <Header as="h1" block>
              MAFIA
            </Header>
          </div>
          <div className="one column row centered">
            <Link to={`/`}>
              <Button
                color="red"
                onClick={this.reset}
                content="START THE GAME"
              />
            </Link>
          </div>
        </div>
      </Container>
    );
  }
}
export default withTracker(() => {
  Meteor.subscribe('currentPlayer');
  Meteor.subscribe('gamePhases');
  Meteor.subscribe('players');
  Meteor.subscribe('messagesForEveryone');
  Meteor.subscribe('messagesForRole');
  Meteor.subscribe('messagesForPlayer');

  return {
    township: Mafia.find().fetch(),
    messages: Messages.find().fetch(),
    currentUserId: Meteor.userId(),
    currentUser: Mafia.find({ player: Meteor.userId() }).fetch(),
    gamePhase: GamePhase.find().fetch()
  };
})(Start);
