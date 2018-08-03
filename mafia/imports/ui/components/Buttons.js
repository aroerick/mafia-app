import React from "react";
import PropTypes from "prop-types";

const Buttons = ({ township, currentUser }) => {
  message = "";
  buttons = null;
  switch (currentUser[0].role) {
    case "mafia":
      message = "Choose a target"
      buttons = township
        .map(villager => <button name={villager.name}>{villager.name}</button>);

      break;
    case "doctor":
      message = "Save someone!";
      buttons = township
        .map(villager => <button name={villager.name}>{villager.name}</button>);
      break;
    case "detective":
      message = <span>Probe. Deep.</span>;
      buttons = township
        .filter(villager => currentUser[0]._id !== villager._id)
        .map(villager => <button name={villager.name}>{villager.name}</button>);
      break;
    default:
      message = "Lullaby and Goodnight";
	}
  return <div><span>{message}</span> {buttons}</div>;
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
