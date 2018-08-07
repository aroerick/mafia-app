import React from "react";
import PropTypes from "prop-types";

const DayButtons = ({ township, currentUser, setLynchTarget }) => {
  return (
    <section>

			<h3>Select a villager for lynching.  Or are you feeling merciful?</h3> 
      <div>
      {township.filter(villager => villager.alive)
        .map(villager => <button name={villager.name} onClick={() => setLynchTarget(villager, currentUser)}>{villager.name}</button>)}
        </div>
        <button name= '' onClick={()=> setLynchTarget('', currentUser)}> No One</button>
    </section>
  );
;
}
  
  


DayButtons.propTypes = {
  township: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      alive: PropTypes.bool.isRequired
    })
  )
};

export default DayButtons;
