import React from "react";
import PropTypes from 'prop-types';

const PlayerList = ({ township }) => (
  <div>
    <ul>{township.map(person => 
    <li key={person._id}> {person.name} ---  Status: {person.alive ? 'is alive' : 'is dead'}
    {/* <input type="checkbox" 
    id={todo._id} checked={todo.completed}
     onChange = {() => handleCheckbox(todo)}/>
    <label htmlFor={todo._id} /> */}

    {/* <button onClick = {()=>handleDeleteTodo(todo)} >
      <i className="fa fa-trash" />
</button>*/}
    </li>)}</ul>
  </div>
);

PlayerList.propTypes = {
    township: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            alive: PropTypes.bool.isRequired
        })
    )
}

export default PlayerList;
