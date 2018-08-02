import React from "react";
import PropTypes from 'prop-types';

const Chatbox = ({ messages }) => (
  <div style={{maxHeight: '400px', overflowY:'scroll'}}>
    <ul>{messages.map(message => 
    <li><p style={{fontWeight: 600}}>{message.sender} to {message.recipient}:</p>
    <span key={message._id}> {message.text} 
    {/* <input type="checkbox" 
    id={todo._id} checked={todo.completed}
     onChange = {() => handleCheckbox(todo)}/>
    <label htmlFor={todo._id} />

    <button onClick = {()=>handleDeleteTodo(todo)} >
      <i className="fa fa-trash" /> */}
    {/* </button> */}
    </span></li>)}</ul>
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