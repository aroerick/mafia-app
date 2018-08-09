import React, { Component } from "react";
import "./styles.css";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Mafia } from "../../api/mafia";
import { Messages } from "../../api/messages";
import { GamePhase } from "../../api/gamePhase";
import PlayerList from "../../ui/components/PlayerList";
import PlayerCard from "../../ui/components/PlayerCard";
import Chatbox from "../../ui/components/Chatbox";
import ChatInput from "../../ui/components/ChatInput";
import Buttons from "../../ui/components/Buttons";
import DayButtons from "../../ui/components/DayButtons";
import {
  Button,
  Divider,
  Header,
  Container,
  Form,
  Message
} from "semantic-ui-react";

class Game extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.playerName = React.createRef();
    this.state = {
      mafiaChatActive: false,
      joinGameError: false,
      joinError: ""
    };
  }
  reset = () => {
    Meteor.call("game.resetAll");
    Meteor.call("messages.handleChatSubmit", {
      sender: "Narrator",
      recipient: "Everyone",
      text:
        "An unsettling energy stirs in the township.  There are rumours the mafia will visit an unlucky villager tonight."
    });
    this.setState({ mafiaChatActive: false });
  };
  handleChatSubmit = e => {
    e.preventDefault();
    let inputRef = this.inputRef.current;
    let currentUser = this.props.currentUser[0];
    if (inputRef.value) {
      Meteor.call("messages.handleChatSubmit", {
        text: inputRef.value,
        sender: currentUser.name,
        recipient: "Everyone"
      });
      this.inputRef.current.value = "";
    }
  };
  handleMafiaChatSubmit = e => {
    e.preventDefault();
    let inputRef = this.inputRef.current;
    let currentUser = this.props.currentUser[0];
    if (inputRef.value) {
      Meteor.call("messages.handleChatSubmit", {
        text: inputRef.value,
        sender: currentUser.name,
        recipient: "Mafia"
      });
      this.inputRef.current.value = "";
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
    Meteor.call("player.createNew", playerName.value, (error, result) => {
      this.setState(result);
      this.startGame();
    });
  };
  startGame = () => {
    if (this.props.township.length === 6) {
      Meteor.call("game.nextPhase");
    }
  };
  setTarget = (villager, currentUser) => {
    Meteor.call("player.setTarget", villager);
    Meteor.call("messages.handleChatSubmit", {
      sender: "Narrator",
      recipient: "Mafia",
      text: `You've targeted ${villager.name} for execution`
    });
    Meteor.call("player.hasActed", currentUser);
    Meteor.call("game.updateFeedback");
  };
  setSaved = (villager, currentUser) => {
    Meteor.call("player.setSaved", villager);
    Meteor.call("messages.handleChatSubmit", {
      sender: "Narrator",
      recipient: "Doctor",
      text: `You've made sure ${villager.name} will make it through the night`
    });
    Meteor.call("player.hasActed", currentUser);
    Meteor.call("game.updateFeedback");
  };
  investigate = (villager, currentUser) => {
    Meteor.call("player.checkMafia", villager._id, (error, result) => {
      result[0].role === "mafia"
        ? Meteor.call("messages.handleChatSubmit", {
            sender: "Narrator",
            recipient: "Detective",
            text: `${villager.name} is part of the Mafia`
          })
        : Meteor.call("messages.handleChatSubmit", {
            sender: "Narrator",
            recipient: "Detective",
            text: `You have no reason to suspect ${villager.name}`
          });
    });
    Meteor.call("player.hasActed", currentUser);
    Meteor.call("game.updateFeedback");
  };
  setLynchTarget = (villager, currentUser) => {
    if (villager === "") {
      // Meteor.call("player.hasActed", currentUser);
      Meteor.call("game.updateDaytimeFeedback");
    } else {
      Meteor.call("player.setLynchTarget", villager);
      Meteor.call("messages.handleChatSubmit", {
        sender: "Narrator",
        recipient: currentUser[0].name,
        text: `You've targeted ${villager.name} for lynching`
      });
      Meteor.call("game.updateDaytimeFeedback");
    }
    Meteor.call("player.hasActed", currentUser);
  };
  filterMessages = role => {
    if (role != "mafia") {
      let filteredMessages = this.props.messages.filter(
        message => message.role != "mafia" && message.recipient != "Mafia"
      );
      return filteredMessages;
    } else {
      let unfilteredMessages = this.props.messages;
      return unfilteredMessages;
    }
  };

  render() {
    const {
      township,
      currentUserId,
      messages,
      gamePhase,
      currentUser
    } = this.props;

    return (
      <Container>
        <Button color="red" onClick={this.reset} content="BOOM" />
        <Header as="h1" block>
          Join the Township. Current population: {this.props.township.length}/6
        </Header>
        {Mafia.find({ player: currentUserId }).count() === 0 ? (
          <Form error={this.state.joinGameError}>
            <Form.Field>
              <input
                type="text"
                placeholder="What's your name?"
                ref={this.playerName}
                onKeyDown={event => {
                  if (event.key == "Enter") {
                    this.joinGame();
                  }
                }}
              />

              <Message
                error
                header="Error in Joining"
                content={this.state.joinError}
              />
            </Form.Field>
          </Form>
        ) : (
          <div>
            <Header as="h3">Welcome to the game</Header>
            <Header as="h2" dividing>
              <PlayerCard currentUser={currentUser} />
            </Header>
            <PlayerList township={township} />
            <Divider horizontal>Chat Area</Divider>
            <Chatbox messages={messages} />
            <ChatInput
              inputRef={this.inputRef}
              handleChatSubmit={
                this.state.mafiaChatActive
                  ? this.handleMafiaChatSubmit
                  : this.handleChatSubmit
              }
              isDisabled={
                (currentUser[0].role !== "mafia" &&
                  gamePhase.length >= 5 &&
                  gamePhase[2].activePhase) ||
                !currentUser[0].alive
                  ? true
                  : false
              }
              currentUser={currentUser}
              toggleMafiaChat={this.toggleMafiaChat}
            />
            {(gamePhase.length >= 5 && !gamePhase[2].activePhase) ||
            this.props.currentUser[0].hasActed ||
            !this.props.currentUser[0].alive ? (
              ""
            ) : (
              <Buttons
                township={township}
                currentUser={currentUser}
                setTarget={this.setTarget}
                setSaved={this.setSaved}
                investigate={this.investigate}
              />
            )}
            {gamePhase.length >= 5 &&
            gamePhase[4].activePhase &&
            !this.props.currentUser[0].hasActed &&
            this.props.currentUser[0].alive ? (
              <DayButtons
                township={township}
                currentUser={currentUser}
                setLynchTarget={this.setLynchTarget}
              />
            ) : (
              ""
            )}
          </div>
        )}
      </Container>
    );
  }
}
export default withTracker(() => {
  Meteor.subscribe("currentPlayer");
  Meteor.subscribe("gamePhases");
  Meteor.subscribe("players");
  Meteor.subscribe("messagesForEveryone");
  Meteor.subscribe("messagesForRole");
  Meteor.subscribe("messagesForPlayer");

  return {
    township: Mafia.find().fetch(),
    messages: Messages.find().fetch(),
    currentUserId: Meteor.userId(),
    currentUser: Mafia.find({ player: Meteor.userId() }).fetch(),
    gamePhase: GamePhase.find().fetch()
  };
})(Game);
