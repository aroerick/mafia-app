import React from "react";
import PropTypes from "prop-types";
import { Input } from "semantic-ui-react";

const ChatInput = ({ inputRef, handleChatSubmit, isDisabled }) => {
  // console.log(isDisabled)
  return (
    <div>
      <form onSubmit={e => handleChatSubmit(e)}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter message here"
          disabled={isDisabled}
        />
        <span> (press enter to add) </span>
      </form>
    </div>
  );
};

export default ChatInput;
