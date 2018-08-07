import React from "react";
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';

const Chatbox = ({ messages }) => (

  <div style={{maxHeight: '400px', overflowY:'scroll'}}>
    {messages.map(message => 
    <Message color={(message.sender === 'Narrator') ? "olive" : "grey"}floating key={message._id}><Message.Header style={{fontWeight: 600}}>{message.sender} to {message.recipient}:</Message.Header>
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
  </div>
);

Chatbox.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
        })
    )
}

export default Chatbox;