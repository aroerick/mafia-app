import React, {Component} from "react"
import "./styles.css";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Mafia } from "../../../api/mafia"
import PlayerList from './../../components/PlayerList'

class App extends Component {
    render(){
        const { township } = this.props

        return (
            <div>
            <h1> Hello Township </h1>
            <PlayerList township={township}/>
            </div>
        )
    }
}


export default withTracker(() => {
    return {
      township: Mafia.find().fetch()
    };
  })(App);