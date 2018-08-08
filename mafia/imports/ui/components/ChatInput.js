import React from "react";
import PropTypes from "prop-types";
import { Form } from "semantic-ui-react";

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
        {currentUser[0].role === "mafia" ? (
          <Form.Checkbox toggle label="Mafia Chat" onChange={toggleMafiaChat} />
        ) : null}
        <Form.Field>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter message here"
            disabled={isDisabled}
          />
        </Form.Field>
      </Form>
    </div>
  );
};

export default ChatInput;
