import React, { Component } from 'react';
import './styles.css';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Mafia } from '../../api/mafia';
import { Messages } from '../../api/messages';
import { GamePhase } from '../../api/gamePhase';
import PlayerList from '../../ui/components/PlayerList';
import PlayerCard from '../../ui/components/PlayerCard';
import Chatbox from '../../ui/components/Chatbox';
import ChatInput from '../../ui/components/ChatInput';
import Buttons from '../../ui/components/Buttons';
import DayButtons from '../../ui/components/DayButtons';
import {
  Button,
  Header,
  Container,
  Form,
  Accordion,
  Message,
  Icon
} from 'semantic-ui-react';
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
  handleChatSubmit = e => {
    e.preventDefault();
    let inputRef = this.inputRef.current;
    let currentUser = this.props.currentUser[0];
    if (inputRef.value) {
      Meteor.call('messages.handleChatSubmit', {
        text: inputRef.value,
        sender: currentUser.name,
        recipient: 'Everyone'
      });
      this.inputRef.current.value = '';
    }
  };
  handleMafiaChatSubmit = e => {
    e.preventDefault();
    let inputRef = this.inputRef.current;
    let currentUser = this.props.currentUser[0];
    if (inputRef.value) {
      Meteor.call('messages.handleChatSubmit', {
        text: inputRef.value,
        sender: currentUser.name,
        recipient: 'Mafia'
      });
      this.inputRef.current.value = '';
    }
  };
  toggleMafiaChat = () => {
    this.setState(prevState => ({
      mafiaChatActive: !prevState.mafiaChatActive
    }));
  };
  joinGame = () => {
    let playerName = this.playerName.current;
    if (playerName.value > 1) return;
    Meteor.call('player.createNew', playerName.value, (error, result) => {
      this.setState(result);
      this.startGame();
    });
  };
  startGame = () => {
    if (this.props.township.length === 6) {
      Meteor.call('game.nextPhase');
    }
  };
  setTarget = (villager, currentUser) => {
    Meteor.call('player.setTarget', villager);
    Meteor.call('messages.handleChatSubmit', {
      sender: 'Narrator',
      recipient: 'Mafia',
      text: `You've targeted ${villager.name} for execution`
    });
    Meteor.call('player.hasActed', currentUser);
    Meteor.call('game.updateFeedback');
  };
  setSaved = (villager, currentUser) => {
    Meteor.call('player.setSaved', villager);
    Meteor.call('messages.handleChatSubmit', {
      sender: 'Narrator',
      recipient: 'Doctor',
      text: `You've made sure ${villager.name} will make it through the night`
    });
    Meteor.call('player.hasActed', currentUser);
    Meteor.call('game.updateFeedback');
  };
  investigate = (villager, currentUser) => {
    Meteor.call('player.checkMafia', villager, (error, result) => {
      result[0].role === 'mafia'
        ? Meteor.call('messages.handleChatSubmit', {
            sender: 'Narrator',
            recipient: 'Detective',
            text: `${villager.name} is part of the Mafia`
          })
        : Meteor.call('messages.handleChatSubmit', {
            sender: 'Narrator',
            recipient: 'Detective',
            text: `You have no reason to suspect ${villager.name}`
          });
    });
    Meteor.call('player.hasActed', currentUser);
    Meteor.call('game.updateFeedback');
  };
  setLynchTarget = (villager, currentUser) => {
    if (villager === '') {
      // Meteor.call('player.hasActed', currentUser);
      Meteor.call('game.updateDaytimeFeedback');
    } else {
      Meteor.call('player.setLynchTarget', villager);
      Meteor.call('messages.handleChatSubmit', {
        sender: 'Narrator',
        recipient: currentUser[0].name,
        text: `You've targeted ${villager.name} for lynching`
      });
      Meteor.call('game.updateDaytimeFeedback');
    }
    Meteor.call('player.hasActed', currentUser);
  };
  filterMessages = role => {
    if (role != 'mafia') {
      let filteredMessages = this.props.messages.filter(
        message => message.role != 'mafia' && message.recipient != 'Mafia'
      );
      return filteredMessages;
    } else {
      let unfilteredMessages = this.props.messages;
      return unfilteredMessages;
    }
  };
  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeAccordion } = this.state;
    const newIndex = activeAccordion === index ? -1 : index;

    this.setState({ activeAccordion: newIndex });
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
        <h2 class="ui icon center aligned header">
          <i aria-hidden="true" className="users circular icon" />
          <Header as="h1" block>
            MAFIA
          </Header>
        </h2>

        <Link to={`/`}>
          <Button color="red" onClick={this.reset} content="START THE GAME" />
        </Link>
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
