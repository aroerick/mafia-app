import React from "react";
import PropTypes from "prop-types";
import { Form } from "semantic-ui-react";

const ChatInput = ({ inputRef, handleChatSubmit, isDisabled }) => {
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
      </Form>
    </div>
  );
};

export default ChatInput;
