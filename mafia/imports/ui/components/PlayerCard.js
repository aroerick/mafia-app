import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'

const PlayerCard = ({ currentUser }
) => (
  <Modal trigger={
    <Button>
      {" "}
      Hello {currentUser[0].name}, you have been assigned
      the role of: {currentUser[0].role}
      {" "}
    </Button>}>
    <Modal.Header>Your Photo</Modal.Header>
    <Modal.Content image>
      <Image wrapped size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' />
      <Modal.Description>
        <Header>
          
        </Header>
        <p></p>
      </Modal.Description>
    </Modal.Content>
  </Modal>
)

export default PlayerCard