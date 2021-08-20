import React from "react";

import classes from "./ExitButton.scss";
import MdKeyboardBackspace from "react-icons/lib/md/keyboard-backspace";

const ExitButton = props => {
  let execute = null;

  if (props.logOutClicked) {
    execute = props.logOutClicked;
  } else {
    execute = props.backHandler;
  }

  return (
    <div className={classes.Container}>
      <div
        tabIndex={props.tabIndex}
        onKeyPress={k => props.keyPressHandler(k, "exit")}
        className={classes.Button}
        onClick={() => execute()}
      >
        <MdKeyboardBackspace />
      </div>
      <div className={classes.Text}>Salir</div>
    </div>
  );
};

export default ExitButton;
