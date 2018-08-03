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
import Buttons from './../../components/Buttons'
// import Actions from "../../components/Actions";

class App extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.playerName = React.createRef();
  }

  handleChatSubmit = (e) => {
    e.preventDefault();
    let inputRef = this.inputRef.current;
    let currentUser = this.props.currentUser[0]

    if (inputRef.value) {
      Meteor.call("messages.handleChatSubmit", {
        text: inputRef.value,
        sender: currentUser.name,
        recipient: "Everyone"
      });
      this.inputRef.current.value = "";
    }
  };

  joinGame = () => {
    let playerName = this.playerName.current;
    if (playerName.value > 1) return;
    Meteor.call("player.createNew", playerName.value);
    this.startGame();
    // Meteor.call("player.updateCurrentUser", playerName.value);
  };

startGame = () => {
    if (this.props.township.length === 5){
        Meteor.call("game.nextPhase")
    }
    
}

  render() {
    const { township, messages, currentUserId, gamePhase, currentUser } = this.props;

    return (

      <div>
        <h1> Join the Township.  Current population: {this.props.township.length}/6 </h1> 
        {Mafia.find({ player: currentUserId}).count() === 0 ?
        <input
          type="text"
          placeholder="Name"
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
           {/* {!gamePhase[2].activePhase ? '' : <Buttons township={township} currentUser={currentUser}/>
        } */}
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
    currentUser: Mafia.find({player: Meteor.userId()}).fetch(),
    gamePhase: GamePhase.find().fetch()
  };
})(App);
