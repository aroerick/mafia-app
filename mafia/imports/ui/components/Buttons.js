import React from "react";
import PropTypes from 'prop-types';

const Buttons = ({ township, currentUser }) => (
  <div>
      <hr/>
      <span>PICK SOMEBODY</span>
      {township.filter(villager => currentUser !== villager.player).map(villager => 
    <input type="button">{villager.name}</input>
    )}
    <hr/>
  </div>
);

Buttons.propTypes = {
    township: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            alive: PropTypes.bool.isRequired
        })
    )
}

export default Buttons;