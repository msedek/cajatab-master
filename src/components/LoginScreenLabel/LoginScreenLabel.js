import React from "react";

import classes from "./LoginScreenLabel.scss";

const LoginScreenLabel = props => (
  <div className={classes.Shape}>
    <div className={classes.Fondo} />
    <div
      className={classes.Icon}
      style={{
        fontSize: props.sizeIcon
      }}
    >
      {props.typeIcon}
    </div>
    <div className={classes.Text}>
      <span className={classes.TextInput}>{props.value}</span>
    </div>
  </div>
);

export default LoginScreenLabel;
