import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const Buttons = ({
  township,
  currentUser,
  setTarget,
  setSaved,
  investigate
}) => {
  message = '';
  actions = null;
  switch (currentUser[0].role) {
    case 'mafia':
      message = 'Choose a target';
      actions = township.filter(villager => villager.alive).map(villager => (
        <Button
          key={villager.name}
          basic
          color="red"
          name={villager.name}
          onClick={() => setTarget(villager, currentUser)}
        >
          {villager.name}
        </Button>
      ));
      break;
    case 'doctor':
      message = 'Save someone!';
      actions = township.filter(villager => villager.alive).map(villager => (
        <Button
          key={villager.name}
          basic
          color="teal"
          name={villager.name}
          onClick={() => setSaved(villager, currentUser)}
        >
          {villager.name}
        </Button>
      ));
      break;
    case 'detective':
      message = <span>Probe. Deep.</span>;
      actions = township
        .filter(villager => villager.alive)
        .filter(villager => currentUser[0]._id !== villager._id)
        .map(villager => (
          <Button
            key={villager.name}
            basic
            color="yellow"
            name={villager.name}
            onClick={() => investigate(villager, currentUser)}
          >
            {villager.name}
          </Button>
        ));
      break;
    default:
      message = 'Lullaby and Goodnight';
  }
  console.log(currentUser);
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
  // currentUser: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     _id: PropTypes.string.isRequired,

  //   })
  // )
};

export default Buttons;
