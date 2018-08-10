import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'

const PlayerCard = ({ currentUser }) => {
  text = '';
  switch (currentUser[0].role) {
    case 'mafia':
      text = 'You pick your victims with your teammate. When the night falls, you have the choice to lynch whoever is you decide to eleminate.'
      break;
    case 'doctor':
      text = 'Try to save the victim who is about to die. And be careful to be the victim yourself!. The more you save lives the more you live!.'
      break;
    case 'detective':
      text = 'Be smart and guess the mafias. Help civilians to live and kill the mafias.'
      break;
    case 'civilian':
      text = 'When the night falls, pray not to be the victim . But if you guessed the mafias when the day comes you will be alive longer!.'
      break;
    default:
      text = 'What Is Your Role?'
  }
  return (
  <Modal trigger={
    <Button>
      {' '}
      Hello {currentUser[0].name}, you have been assigned
      the role of: {currentUser[0].role}
      {' '}
    </Button>}>
    <Modal.Header>{currentUser[0].name}</Modal.Header>
    <Modal.Content image>
      <Image wrapped size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' />
      <Modal.Description>
        <Header>{currentUser[0].role}
        </Header>
          <p>{text}</p>
      </Modal.Description>
    </Modal.Content>
  </Modal>
)
}

export default PlayerCard