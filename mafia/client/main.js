import React from 'react';
import ReactDOM from 'react-dom'
import './main.css'
import App from './../imports/ui/containers/App';
import {Meteor} from 'meteor/meteor'
import './main.html';
import registerServiceWorker from './registerServiceWorker'

Meteor.startup(()=>{ 
  ReactDOM.render(<App />, document.getElementById('root'))
  registerServiceWorker()
});
