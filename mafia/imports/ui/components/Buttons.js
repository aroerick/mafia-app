import React from "react";
import PropTypes from "prop-types";

const Buttons = ({ township, currentUser }) => {
  message = "";
  actions = null;
  switch (currentUser[0].role) {
    case "mafia":
      message = "Choose a target";
      actions = township
        .filter(villager => villager.alive)
        .map(villager => <button name={villager.name}>{villager.name}</button>);

      break;
    case "doctor":
      message = "Save someone!";
      actions = township
        .filter(villager => villager.alive)
        .map(villager => <button name={villager.name}>{villager.name}</button>);
      break;
    case "detective":
      message = <span>Probe. Deep.</span>;
      actions = township
        .filter(villager => villager.alive)
        .filter(villager => currentUser[0]._id !== villager._id)
        .map(villager => <button name={villager.name}>{villager.name}</button>);
      break;
    default:
      message = "Lullaby and Goodnight";
  }
  return (
    <section>
			<h3>{message}</h3> 
			<div>{actions}</div>
    </section>
  );
};

Buttons.propTypes = {
  township: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      alive: PropTypes.bool.isRequired
    })
  )
};

export default Buttons;
