import React from "react";
import PropTypes from "prop-types";
import { Input, Form } from "semantic-ui-react";

const ChatInput = ({ inputRef, handleChatSubmit, isDisabled }) => {
  // console.log(isDisabled)
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
        {/* <label> (press enter to add) </label> */}
        </Form.Field>
      </Form>
    </div>
  );
};

export default ChatInput;
