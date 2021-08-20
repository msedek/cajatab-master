import React from "react";

import classes from "./LoginScreenShape.scss";

const LoginScreenShape = props => (
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
      <input
        className={classes.TextInput}
        type={props.type}
        name={props.name}
        placeholder={props.boxType}
        onChange={e => props.changeHandler(e)}
        value={props.value}
      />
    </div>
  </div>
);

export default LoginScreenShape;
