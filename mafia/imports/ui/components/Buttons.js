import React from "react";
import PropTypes from 'prop-types';

const Buttons = ({ township, currentUser }) => (
  <div>
      <hr/>
      <span>PICK SOMEBODY</span>
      {township.filter(villager => currentUser[0]._id !== villager._id).map(villager => 
      <div>
    <button key={villager._id} name={villager.name}>{villager.name}</button>
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