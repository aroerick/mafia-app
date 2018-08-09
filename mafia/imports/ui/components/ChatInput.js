import React from "react";
import PropTypes from "prop-types";
import { Form, Label } from "semantic-ui-react";

const ChatInput = ({
  inputRef,
  handleChatSubmit,
  isDisabled,
  currentUser,
  toggleMafiaChat
}) => {
  return (
    <div>
      <Form onSubmit={e => handleChatSubmit(e)}>
        <Form.Field>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter message here"
            disabled={isDisabled}
          />
        </Form.Field>
        {currentUser && currentUser[0].role === "mafia" ? (
          <Form.Group>
            <Label content="All Chat" size="tiny" pointing="right" />
            <Form.Checkbox slider onChange={toggleMafiaChat} />
            <Label content="Mafia Chat" size="tiny" pointing="left"/>
          </Form.Group>
        ) : null}
      </Form>
    </div>
  );
};

export default ChatInput;
