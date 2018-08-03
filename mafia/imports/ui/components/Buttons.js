import React from "react";
import PropTypes from 'prop-types';

const Buttons = ({ township, currentUser }) => (
  <div>
      <hr/>
      <span>PICK SOMEBODY</span>
      {township.filter(villager => currentUser !== villager.player).map(villager => 
    // <input type="text">{villager.name}</input>
    <div>
    {console.log(villager.name)}
    <p>hello</p>
    <button>{villager.name}</button>
    </div>
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