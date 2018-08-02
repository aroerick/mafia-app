import React, {Component} from "react"
import "./styles.css";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Mafia } from "../../../api/mafia"
import { Messages } from '../../../api/messages'
import PlayerList from './../../components/PlayerList'
import Chatbox from './../../components/Chatbox'
import ChatInput from './../../components/ChatInput'
import Actions from '../../components/Actions'

class App extends Component {
    constructor(props){
        super(props);
        this.inputRef = React.createRef(); 
       }

       handleChatSubmit = e => {
           e.preventDefault()
           let inputRef = this.inputRef.current
           if (inputRef.value){
               Meteor.call('messages.handleChatSubmit',{
                   text: inputRef.value,
                   sender: 'Bob',
                   recipient: 'everyone'
               });
               this.inputRef.current.value = ''
           }
       }

    render(){
        const { township, messages } = this.props
        // const activePlayer = township[0]
        // console.log(activePlayer, 'active player')
        return (
            <div>
            <h1> Hello Township </h1>
            <PlayerList township={township}/>
            <hr/>////CHAT AREA////<hr/>
            <Chatbox messages={messages}/>
            <ChatInput 
            inputRef={this.inputRef}
            handleChatSubmit={this.handleChatSubmit}
            />
            {/* <Actions township={township}/> */}
            </div>
        )
    }
}


export default withTracker(() => {
    return {
      township: Mafia.find().fetch(),
      messages: Messages.find().fetch()
    };
  })(App);