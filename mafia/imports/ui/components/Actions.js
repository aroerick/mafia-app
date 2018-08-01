import React from "react";

const Actions = ({ township }) => {
    const player = township[0]
  switch (player.role) {
    case "mafia":
      return(<div>Kill</div>);
    case "detective":
      return(<div>Investigate</div>);
    case "doctor":
      return(<div>Save</div>);
    default:
      return(<div>The night is dark and full of terrors.</div>);
  }
};

export default Actions;
