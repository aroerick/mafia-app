import React, { Component } from "react";
import "./styles.css";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Mafia } from "../../../api/mafia";
import { Messages } from "../../../api/messages";
import PlayerList from "./../../components/PlayerList";
import Chatbox from "./../../components/Chatbox";
import ChatInput from "./../../components/ChatInput";
import Actions from "../../components/Actions";

class App extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.playerName = React.createRef();
  }

  handleChatSubmit = e => {
    e.preventDefault();
    let inputRef = this.inputRef.current;
    let currentUser = this.props.currentUser[0]

    if (inputRef.value) {
      Meteor.call("messages.handleChatSubmit", {
        text: inputRef.value,
        sender: currentUser.name,
        recipient: "everyone"
      });
      this.inputRef.current.value = "";
    }
  };

  joinGame = () => {
    let playerName = this.playerName.current;
    if (playerName.value > 1) return;
    Meteor.call("player.createNew", playerName.value);
  };

  render() {
    const { township, messages, currentUserId, currentUser } = this.props;
    // const activePlayer = township[0]
    // console.log(activePlayer, 'active player')
    // console.log(currentUser.name)
    return (

      <div>
        <h1> Hello Township </h1>
        {Mafia.find({ player: currentUserId}).count() === 0 ?
        <input
          type="text"
          ref={this.playerName}
          onKeyDown={event => {
            if (event.key == "Enter") {
              this.joinGame();
            }
          }}
        /> : <div>Welcome to the game</div>
        }
        <PlayerList township={township} />
        <hr />////CHAT AREA////<hr />
        <Chatbox messages={messages} />
        <ChatInput
          inputRef={this.inputRef}
          handleChatSubmit={this.handleChatSubmit}
        />
        {/* <Actions township={township}/> */}
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    township: Mafia.find().fetch(),
    messages: Messages.find().fetch(),
    currentUserId: Meteor.userId(),
    currentUser: Mafia.find({player: Meteor.userId()}).fetch()
  };
})(App);
