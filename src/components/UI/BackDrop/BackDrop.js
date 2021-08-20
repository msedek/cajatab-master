import React from "react";

import classes from "./BackDrop.scss";

const backDrop = props => {
  return props.show ? (
    <div className={classes.BackDrop} onClick={props.clickOnBackDrop} />
  ) : null;
};

export default backDrop;
