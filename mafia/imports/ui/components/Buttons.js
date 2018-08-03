import React from "react";
import PropTypes from "prop-types";

<<<<<<< HEAD
const Buttons = ({ township, currentUser, setTarget, setSaved, investigate }) => {
=======
const Buttons = ({ township, currentUser, handleSelect }) => {
>>>>>>> d90fac1f5b75289a43ac8211c6895f0dac7e9960
  message = "";
  actions = null;
  switch (currentUser[0].role) {
    case "mafia":
      message = "Choose a target";
      actions = township
        .filter(villager => villager.alive)
<<<<<<< HEAD
        .map(villager => <button name={villager.name} onClick={() => setTarget(villager._id)}>{villager.name}</button>);
=======
        .map(villager => <button name={villager.name} onClick={()=>handleSelect(villager)}>{villager.name}</button>);

>>>>>>> d90fac1f5b75289a43ac8211c6895f0dac7e9960
      break;
    case "doctor":
      message = "Save someone!";
      actions = township
        .filter(villager => villager.alive)
<<<<<<< HEAD
        .map(villager => <button name={villager.name} onClick={() => setSaved(villager._id)}>{villager.name}</button>);
=======
        .map(villager => <button name={villager.name} onClick={()=>handleSelect(villager)}>{villager.name}</button>);
>>>>>>> d90fac1f5b75289a43ac8211c6895f0dac7e9960
      break;
    case "detective":
      message = <span>Probe. Deep.</span>;
      actions = township
        .filter(villager => villager.alive)
        .filter(villager => currentUser[0]._id !== villager._id)
<<<<<<< HEAD
        .map(villager => <button name={villager.name} onClick={() => investigate(villager._id)}>{villager.name}</button>);
=======
        .map(villager => <button name={villager.name} onClick={()=>handleSelect(villager)}>{villager.name}</button>);
>>>>>>> d90fac1f5b75289a43ac8211c6895f0dac7e9960
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
