import React, { Component } from "react";
import "./styles.css";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Mafia } from "../../../api/mafia";
import { Messages } from "../../../api/mafia";
import { GamePhase } from "../../../api/mafia";
import PlayerList from "./../../components/PlayerList";
import Chatbox from "./../../components/Chatbox";
import ChatInput from "./../../components/ChatInput";
import Buttons from "./../../components/Buttons";
import DayButtons from "./../../components/DayButtons";
import { Button, Divider, Header, Container, Form } from "semantic-ui-react";

class Victory extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.playerName = React.createRef();
  }

  reset = () => {
    Meteor.call("game.resetAll");
    Meteor.call("messages.handleChatSubmit", {
      sender: "Narrator",
      recipient: "Everyone",
      text:
        "An unsettling energy stirs in the township.  There are rumours the mafia will visit an unlucky villager tonight."
    });
  };

  handleChatSubmit = e => {
    e.preventDefault();
    let inputRef = this.inputRef.current;
    let currentUser = this.props.currentUser[0];
    if (inputRef.value) {
      Meteor.call("messages.handleChatSubmit", {
        text: inputRef.value,
        sender: currentUser.name,
        recipient: "Everyone",
        role: currentUser.role
      });
      this.inputRef.current.value = "";
    }
  };

  joinGame = () => {
    let playerName = this.playerName.current;
    if (playerName.value > 1) return;
    Meteor.call("player.createNew", playerName.value);
    this.startGame();
  };

  startGame = () => {
    if (this.props.township.length === 5) {
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
    const inv = Mafia.find({ _id: villager._id }).fetch();
    const check = inv[0].role === "mafia" ? true : false;
    {
      check
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
    }
    Meteor.call("player.hasActed", currentUser);
    Meteor.call("game.updateFeedback");
  };

  setLynchTarget = (villager, currentUser) => {
    if (villager === "") {
      Meteor.call("player.hasActed", currentUser);
      Meteor.call("game.updateDaytimeFeedback");
    } else {
      Meteor.call("player.setLynchTarget", villager);
      Meteor.call("messages.handleChatSubmit", {
        sender: "Narrator",
        recipient: currentUser[0].name,
        text: `You've targeted ${villager.name} for lynching`
      });
      Meteor.call("player.hasActed", currentUser);
      Meteor.call("game.updateDaytimeFeedback");
    }
  };

  handleSelect = button => {
    console.log(button);
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
    const { township, currentUserId, gamePhase, currentUser } = this.props;

    return this.props.currentUser ? (
      <Container>
        <Button color="red" onClick={this.reset} content="BOOM" />
        <Header as="h1" block>
          VICTORY PAGE
        </Header>
        <Header as="h1" block>
          Join the Township. Current population: {this.props.township.length}/6
        </Header>
        {Mafia.find({ player: currentUserId }).count() === 0 ? (
          <Form>
            <Form.Field>
              <input
                icon="users"
                iconPosition="left"
                type="text"
                placeholder="What's your name?"
                ref={this.playerName}
                onKeyDown={event => {
                  if (event.key == "Enter") {
                    this.joinGame();
                  }
                }}
              />
            </Form.Field>
          </Form>
        ) : (
          <div>
            <Header as="h3">Welcome to the game</Header>
            <Header as="h2" dividing>
              {" "}
              Hello {this.props.currentUser[0].name}, you have been assigned the
              role of: {this.props.currentUser[0].role}{" "}
            </Header>
            <PlayerList township={township} />
            <Divider horizontal>Chat Area</Divider>
            <Chatbox
              messages={this.filterMessages(this.props.currentUser[0].role)}
            />
            <ChatInput
              inputRef={this.inputRef}
              handleChatSubmit={this.handleChatSubmit}
              isDisabled={
                (currentUser[0].role !== "mafia" &&
                  gamePhase.length >= 5 &&
                  gamePhase[2].activePhase) ||
                !currentUser[0].alive
                  ? true
                  : false
              }
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
    ) : (
      ""
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe("currentPlayer");
  Meteor.subscribe("gamePhases");
  Meteor.subscribe("players");
  Meteor.subscribe("messages");
  return {
    township: Mafia.find().fetch(),
    messages: Messages.find().fetch(),
    currentUserId: Meteor.userId(),
    currentUser: Mafia.find({ player: Meteor.userId() }).fetch(),
    gamePhase: GamePhase.find().fetch()
  };
})(Victory);
