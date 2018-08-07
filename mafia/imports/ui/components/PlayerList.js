import React from "react";
import PropTypes from "prop-types";
import { List } from "semantic-ui-react";

const PlayerList = ({ township }) => (
  <div>
    <List>
      {township.map(person => (
        <List.Item key={person._id}>
          <List.Icon name="user" />
          <List.Content>
            <List.Header>{person.name}</List.Header>
            <List.Description>
              Status: {person.alive ? "is alive" : "is dead"}
            </List.Description>
          </List.Content>
          {/* <input type="checkbox" 
    id={todo._id} checked={todo.completed}
     onChange = {() => handleCheckbox(todo)}/>
    <label htmlFor={todo._id} /> */}

          {/* <button onClick = {()=>handleDeleteTodo(todo)} >
      <i className="fa fa-trash" />
</button>*/}
        </List.Item>
      ))}
    </List>
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
};

export default PlayerList;
