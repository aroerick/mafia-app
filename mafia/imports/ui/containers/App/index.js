import React, {Component} from "react"
import "./styles.css";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Mafia } from "../../../api/mafia"

class App extends Component {
    render(){
        return (
            <h1> Hello Township </h1>
        )
    }
}


export default withTracker(() => {
    return {
      mafia: Mafia.find().fetch()
    };
  })(App);