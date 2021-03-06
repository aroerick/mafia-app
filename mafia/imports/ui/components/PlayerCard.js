import React from 'react';
import { Button, Header, Image, Modal, Icon } from 'semantic-ui-react';

const PlayerCard = ({ currentUser }) => {
  text = '';
  roleTitle = '';
  roleName = '';
  color = '';
  image = '';
  switch (currentUser[0].role) {
    case 'mafia':
      text =
        'You pick your victims with your teammate. When the night falls, you have the choice to lynch whoever is you decide to eleminate.';
      roleTitle = 'a Mafioso';
      roleName = 'Mafia';
      color = 'red';
      image = 'https://i.imgur.com/6VWBxfU.png';
      break;
    case 'doctor':
      text =
        'Try to save the victim who is about to die. And be careful to be the victim yourself!. The more you save lives the more you live!.';
      roleTitle = 'the Doctor';
      roleName = 'Doctor';
      color = 'teal';
      image = 'https://i.imgur.com/5hhxES1.png';
      break;
    case 'detective':
      text =
        'Be smart and guess the mafias. Help civilians to live and kill the mafias.';
      roleTitle = 'the Detective';
      roleName = 'Detective';
      color = 'yellow';
      image = 'https://i.imgur.com/NSQkODv.png';
      break;
    default:
      text =
        'When the night falls, pray not to be the victim . But if you guessed the mafias when the day comes you will be alive longer!.';
      roleTitle = 'a Civilian';
      roleName = 'Civilian';
      color = 'purple';
      image = 'https://i.imgur.com/69zvGYQ.png';
  }
  return (
    <Modal
      trigger={
        <Button
          fluid
          color={color}
          icon
          labelPosition="right"
          style={{ marginBottom: 15 }}
        >
          {currentUser[0].name}, you are {roleTitle}
          <Icon name="align left" />
        </Button>
      }
    >
      <Modal.Header>{currentUser[0].name}</Modal.Header>
      <Modal.Content image>
        <Image wrapped src={image} />
        <Modal.Description>
          <Header>{roleName}</Header>
          <p>{text}</p>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export default PlayerCard;
