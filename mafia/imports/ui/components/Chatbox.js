import React, { Component } from "react";
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';

class Chatbox extends Component {
  UNSAFE_componentWillUpdate(){
    const node = ReactDOM.findDOMNode(this)
    this.shouldScrollToBottom = node.scrollTop + node.clientHeight >= node.scrollHeight
  }
  componentDidUpdate(){
    const node = ReactDOM.findDOMNode(this)
    node.scrollTop = node.scrollHeight
  }
  render(){
    const { messages } = this.props
    return (
      <div style={{maxHeight: '400px', overflowY:'scroll'}}>
        {messages.map(message => 
        <Message color={(message.sender === 'Narrator') ? "olive" : "grey"}floating key={message._id}>
          <Message.Header style={{fontWeight: 600}}>{message.sender} to {message.recipient}:</Message.Header>
        {/* <span>  */}
        {message.text} 
        {/* <input type="checkbox" 
        id={todo._id} checked={todo.completed}
         onChange = {() => handleCheckbox(todo)}/>
        <label htmlFor={todo._id} />
    
        <button onClick = {()=>handleDeleteTodo(todo)} >
          <i className="fa fa-trash" /> */}
        {/* </button> */}
        {/* </span> */}
        </Message>)}
        {/* <div  style={{ float:"left", clear: "both" }}
              ref={(el) => { this.messagesEnd = el; }}>
        </div> */}
      </div>
    );
  }
}

Chatbox.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  )
};

export default Chatbox;
