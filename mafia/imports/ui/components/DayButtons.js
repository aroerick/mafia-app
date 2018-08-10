import React from "react";
import PropTypes from "prop-types";
import { Button, Header } from "semantic-ui-react";

const DayButtons = ({ township, currentUser, setLynchTarget }) => {
  return (
    <section>
      <Header as="h3">
        Select a villager for lynching. Or are you feeling merciful?
      </Header>
      <div>
        {township.filter(villager => villager.alive).map(villager => (
          <Button
            key={villager.name}
            basic
            color="purple"
            name={villager.name}
            onClick={() => setLynchTarget(villager, currentUser)}
          >
            {villager.name}
          </Button>
        ))}
      </div>
      <Button
        basic
        color="purple"
        name=""
        onClick={() => setLynchTarget("", currentUser)}
      >
        No One
      </Button>
    </section>
  );
};

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
