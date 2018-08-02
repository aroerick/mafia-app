import React from "react";
import PropTypes from "prop-types";

const ChatInput = ({ inputRef, handleChatSubmit}) => {
  return (
    <div>
      <form onSubmit = {(e)=> handleChatSubmit(e)}>
        <input ref={ inputRef } type="text" placeholder="Enter message here" />
        <span> (press enter to add) </span>
      </form>
    </div>
  );
};

export default ChatInput;