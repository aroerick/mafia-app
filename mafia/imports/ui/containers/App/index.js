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

  handleChatSubmit = (e) => {
    e.preventDefault();
    let inputRef = this.inputRef.current;
<<<<<<< HEAD
    let currentUser = this.props.currentUser[0]

    if (inputRef.value) {
      Meteor.call("messages.handleChatSubmit", {
        text: inputRef.value,
        sender: currentUser.name,
=======
    let currentPlayer = this.props.township.filter(user => user.player === this.props.currentUserId)
    console.log(theBoss, 'theboss')
    console.log(this.props.township)
    if (inputRef.value) {
      Meteor.call("messages.handleChatSubmit", {
        text: inputRef.value,
        sender: currentPlayer[0].name,
>>>>>>> 8b61838cb5431933afb0a2b1b0d586366834bc73
        recipient: "everyone"
      });
      this.inputRef.current.value = "";
    }
  };

  joinGame = () => {
    let playerName = this.playerName.current;
    if (playerName.value > 1) return;
    Meteor.call("player.createNew", playerName.value);
    // Meteor.call("player.updateCurrentUser", playerName.value);
  };

  render() {
<<<<<<< HEAD
    const { township, messages, currentUserId, currentUser } = this.props;
    // const activePlayer = township[0]
    // console.log(activePlayer, 'active player')
    // console.log(currentUser.name)
=======
    const { township, messages, currentUserId } = this.props;
    const currentUser = Mafia.find({ player: currentUserId})
console.log(currentUser)
>>>>>>> 8b61838cb5431933afb0a2b1b0d586366834bc73
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
        /> : 
        <div>
        <div>Welcome to the game</div>
        <PlayerList township={township} />
        <hr />////CHAT AREA////<hr />
        <Chatbox messages={messages}/>
        <ChatInput
          inputRef={this.inputRef}
          handleChatSubmit={this.handleChatSubmit}
        />
        </div>
        }
        
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
