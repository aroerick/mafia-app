import React, {Component} from "react"
import "./styles.css";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Mafia } from "../../../api/mafia"
import PlayerList from './../../components/PlayerList'
import Actions from '../../components/Actions'

class App extends Component {
    render(){
        const { township } = this.props
        console.log({township})
        return (
            <div>
            <h1> Hello Township </h1>
            <PlayerList township={township}/>
            <Actions player={township} />
            </div>
        )
    }
}


export default withTracker(() => {
    return {
      township: Mafia.find().fetch()
    };
  })(App);