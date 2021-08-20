import React from "react";

import classes from "./MultiButton.scss";

const MultiButton = props => (
  <div
    className={classes.Button}
    style={{
      background: props.multiBackColor,
      width: props.multiWidth,
      borderRadius: props.multiBorderRad,
      fontSize: props.multiFont
    }}
    onClick={props.clicked}
  >
    {props.textMultiButton}
  </div>
);

export default MultiButton;
